import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
      subject: 'Verify Your Account - Project Wayfinder',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #556B2F; border-radius: 8px; background-color: #F5F5DC;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #556B2F; margin-bottom: 10px;">Welcome to Project Wayfinder!</h2>
            <p style="color: #556B2F; font-size: 16px;">Please verify your email address to complete your registration.</p>
          </div>
          
          <div style="background-color: #556B2F; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0;">
            <h3 style="color: #F5F5DC; margin-bottom: 15px;">Your Verification Code</h3>
            <div style="background-color: #F5F5DC; color: #556B2F; font-size: 32px; font-weight: bold; padding: 15px; border-radius: 6px; letter-spacing: 5px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
            <p style="color: #F5F5DC; margin-top: 15px; font-size: 14px;">This code will expire in 10 minutes.</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #556B2F;">
            <p style="color: #556B2F; font-size: 14px; margin-bottom: 10px;">
              If you didn't create an account with us, please ignore this email.
            </p>
            <p style="color: #556B2F; font-size: 14px;">
              Best regards,<br>
              The Project Wayfinder Team
            </p>
          </div>
        </div>
      `,
      text: `Welcome to Project Wayfinder!

Please verify your email address to complete your registration.

Your Verification Code: ${code}

This code will expire in 10 minutes.

If you didn't create an account with us, please ignore this email.

Best regards,
The Project Wayfinder Team`,
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

  async verifyRegistrationOtp(email: string, code: string): Promise<{ success: boolean; message: string; user?: any; accessToken?: string; refreshToken?: string }> {
    console.log('🔍 verifyRegistrationOtp called with:', { email, code });
    
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { otps: true },
    }) as User & { otps: Otp[] };

    if (!user) throw new NotFoundException('User not found');

    console.log('👤 User found:', { user_id: user.user_id, email: user.email });
    console.log('📧 All OTPs for user:', user.otps.map(otp => ({
      id: otp.id,
      code: otp.code,
      purpose: otp.purpose,
      isUsed: otp.isUsed,
      expiresAt: otp.expiresAt,
      createdAt: otp.createdAt
    })));

    // Find the latest registration OTP
    const registrationOtps = user.otps
      .filter(otp => otp.purpose === 'registration' && !otp.isUsed)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log('🎯 Registration OTPs (unused):', registrationOtps.map(otp => ({
      id: otp.id,
      code: otp.code,
      expiresAt: otp.expiresAt
    })));

    const registrationOtp = registrationOtps[0];

    if (!registrationOtp) {
      console.log('❌ No unused registration OTP found');
      throw new BadRequestException('No verification code found. Please request a new one.');
    }

    console.log('🔐 Comparing codes:', { 
      provided: code, 
      stored: registrationOtp.code, 
      match: code === registrationOtp.code 
    });

    if (registrationOtp.code !== code) {
      console.log('❌ Code mismatch');
      throw new BadRequestException('Invalid verification code');
    }

    console.log('⏰ Checking expiry:', { 
      expiresAt: registrationOtp.expiresAt, 
      now: new Date(), 
      isExpired: registrationOtp.expiresAt < new Date() 
    });

    if (registrationOtp.expiresAt < new Date()) {
      console.log('❌ OTP expired');
      throw new BadRequestException('Verification code has expired');
    }

    console.log('✅ Code is valid, proceeding with verification');

    // Mark OTP as used
    await this.prisma.otp.update({
      where: { id: registrationOtp.id },
      data: { isUsed: true },
    });

    // Mark user as email verified
    await this.prisma.user.update({
      where: { user_id: user.user_id },
      data: { isEmailVerified: true },
    });

    console.log('✅ User verified successfully');

    // Generate JWT tokens for automatic login after verification
    const accessToken = this.jwtService.sign({ sub: user.user_id, email: user.email }, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign({ sub: user.user_id, email: user.email }, { expiresIn: '3h' });

    // Store tokens in database
    await this.prisma.jwtToken.create({
      data: {
        token: accessToken,
        refreshToken: refreshToken,
        userId: user.user_id,
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
      },
    });

    const response = { 
      success: true,
      message: 'Email verified successfully! You are now logged in.',
      user: { 
        email: user.email, 
        user_id: user.user_id, 
        isEmailVerified: true,
        firstName: user.firstName,
        lastName: user.lastName
      },
      accessToken,
      refreshToken
    };

    console.log('📤 Sending response to frontend:', response);
    return response;
  }
}
