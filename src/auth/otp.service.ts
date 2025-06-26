import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User, Otp } from '@prisma/client';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private OTP_EXPIRY_MINUTES = 10;

  async sendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60000);

    // Remove previous unused registration OTPs
    await this.prisma.otp.deleteMany({ where: { userId: user.user_id, purpose: 'registration', isUsed: false } });

    await this.prisma.otp.create({
      data: {
        code,
        expiresAt,
        userId: user.user_id,
        purpose: 'registration',
      },
    });

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verify your account',
      text: `Your verification code is: ${code}`,
    });

    return { message: `Verification code sent to ${email}` };
  }

  async sendOtp(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60000);

    await this.prisma.otp.deleteMany({ where: { userId: user.user_id } });

    await this.prisma.otp.create({
      data: {
        code,
        expiresAt,
        userId: user.user_id,
        purpose: 'login',
      },
    });

    // Replace this with actual email sending logic
    return { message: `OTP sent to ${email}. Code: ${code}` };
  }

  async verifyOtp(email: string, code: string): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { otps: true },
    }) as User & { otps: Otp[] }; // 👈 Cast user type manually here

    if (!user) throw new NotFoundException('User not found');

    const latestOtp = user.otps[user.otps.length - 1]; // latest OTP

    if (!latestOtp || latestOtp.code !== code) {
      throw new BadRequestException('Invalid OTP');
    }

    if (latestOtp.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    await this.prisma.otp.delete({ where: { id: latestOtp.id } });

    const token = this.jwtService.sign({ sub: user.user_id, email: user.email });

    return { accessToken: token };
  }
}
