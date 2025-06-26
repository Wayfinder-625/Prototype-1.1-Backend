import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  private ACCESS_TOKEN_EXPIRES_IN = '15m';
  private REFRESH_TOKEN_EXPIRES_IN = '3h';

  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    gender?: string;
    location?: string;
  }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new BadRequestException('Email already registered');
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        location: data.location,
      },
    });
    // Send verification email automatically
    await this.otpService.sendVerificationEmail(user.email);
    
    return { 
      message: 'Registration successful! Please check your email and verify your account to complete registration.',
      user: { email: user.email, user_id: user.user_id },
      requiresVerification: true
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) throw new NotFoundException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new BadRequestException('Invalid credentials');
    const accessToken = this.jwtService.sign({ sub: user.user_id, email: user.email }, { expiresIn: this.ACCESS_TOKEN_EXPIRES_IN });
    const refreshToken = this.jwtService.sign({ sub: user.user_id, email: user.email }, { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN });
    await this.prisma.jwtToken.create({
      data: {
        token: accessToken,
        refreshToken: refreshToken,
        userId: user.user_id,
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      },
    });
    return { message: 'Login successful', user: { email: user.email, user_id: user.user_id }, accessToken, refreshToken };
  }

  async refreshToken(oldRefreshToken: string) {
    // Check if refresh token exists and is valid
    const tokenRecord = await this.prisma.jwtToken.findUnique({ where: { refreshToken: oldRefreshToken } });
    if (!tokenRecord) throw new BadRequestException('Invalid refresh token');
    // Optionally: check expiry
    if (tokenRecord.expiresAt < new Date()) throw new BadRequestException('Refresh token expired');
    // Generate new tokens
    const user = await this.prisma.user.findUnique({ where: { user_id: tokenRecord.userId } });
    if (!user) throw new NotFoundException('User not found');
    const newAccessToken = this.jwtService.sign({ sub: user.user_id, email: user.email }, { expiresIn: this.ACCESS_TOKEN_EXPIRES_IN });
    const newRefreshToken = this.jwtService.sign({ sub: user.user_id, email: user.email }, { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN });
    // Update the token record
    await this.prisma.jwtToken.update({
      where: { id: tokenRecord.id },
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
      },
    });
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async signOut(token: string) {
    // Blacklist the token
    await this.prisma.tokenBlacklist.create({
      data: {
        token,
      },
    });
    // Optionally: delete from jwtToken table
    await this.prisma.jwtToken.deleteMany({ where: { token } });
    return { message: 'Signed out successfully' };
  }
}
