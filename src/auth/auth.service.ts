import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { OtpService } from './otp.service';
import { randomBytes } from 'crypto';

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
    const isProfileComplete = !!(data.dateOfBirth && data.gender && data.location);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        location: data.location,
        isProfileComplete,
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

  async validateGoogleUser(profile: any) {
    const { email, firstName, lastName } = profile;
    
    // Check if user exists
    let user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      // Generate a random password for Google users
      const randomPassword = randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Create new user with Google info
      user = await this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
          isEmailVerified: true, // Google users are pre-verified
          isActive: true,
          isProfileComplete: false,
        },
      });
    }

    // Check for missing profile fields
    const missingFields: string[] = [];
    if (!user.dateOfBirth) missingFields.push('dateOfBirth');
    if (!user.gender) missingFields.push('gender');
    if (!user.location) missingFields.push('location');

    // Update isProfileComplete if needed
    const shouldBeComplete = missingFields.length === 0;
    if (user.isProfileComplete !== shouldBeComplete) {
      user = await this.prisma.user.update({
        where: { user_id: user.user_id },
        data: { isProfileComplete: shouldBeComplete },
      });
    }

    // Generate tokens
    const accessToken = this.jwtService.sign(
      { sub: user.user_id, email: user.email },
      { expiresIn: this.ACCESS_TOKEN_EXPIRES_IN }
    );
    const refreshToken = this.jwtService.sign(
      { sub: user.user_id, email: user.email },
      { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN }
    );

    // Store tokens
    await this.prisma.jwtToken.create({
      data: {
        token: accessToken,
        refreshToken: refreshToken,
        userId: user.user_id,
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
      },
    });

    return {
      message: 'Google login successful',
      user: {
        email: user.email,
        user_id: user.user_id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken,
      refreshToken,
      requiresProfileCompletion: missingFields.length > 0,
      missingFields,
    };
  }

  async completeProfile(userId: number, profileData: {
    dateOfBirth?: Date;
    gender?: string;
    location?: string;
  }) {
    try {
      const user = await this.prisma.user.findUnique({ where: { user_id: userId } });
      if (!user) throw new NotFoundException('User not found');

      const updatedUser = await this.prisma.user.update({
        where: { user_id: userId },
        data: profileData,
      });

      // Check if profile is now complete
      const isProfileComplete = !!(updatedUser.dateOfBirth && updatedUser.gender && updatedUser.location);
      if (updatedUser.isProfileComplete !== isProfileComplete) {
        await this.prisma.user.update({
          where: { user_id: userId },
          data: { isProfileComplete },
        });
      }

      // Issue new tokens after profile completion
      const accessToken = this.jwtService.sign(
        { sub: updatedUser.user_id, email: updatedUser.email },
        { expiresIn: this.ACCESS_TOKEN_EXPIRES_IN }
      );
      const refreshToken = this.jwtService.sign(
        { sub: updatedUser.user_id, email: updatedUser.email },
        { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN }
      );
      await this.prisma.jwtToken.create({
        data: {
          token: accessToken,
          refreshToken: refreshToken,
          userId: updatedUser.user_id,
          expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
        },
      });

      return {
        message: 'Profile completed successfully',
        user: {
          email: updatedUser.email,
          user_id: updatedUser.user_id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          dateOfBirth: updatedUser.dateOfBirth,
          gender: updatedUser.gender,
          location: updatedUser.location,
          isProfileComplete,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('Complete profile error:', error);
      throw error;
    }
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
