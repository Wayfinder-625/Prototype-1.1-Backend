import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { OtpService } from './otp.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    return this.otpService.sendOtp(email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; code: string }) {
    return this.otpService.verifyOtp(body.email, body.code);
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string; firstName?: string; lastName?: string; dateOfBirth?: Date; gender?: string; location?: string }) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('signout')
  async signOut(@Body('token') token: string) {
    return this.authService.signOut(token);
  }

  @Post('send-verification')
  async sendVerification(@Body('email') email: string) {
    return this.otpService.sendVerificationEmail(email);
  }

  // ✅ Add this route to test JWT protection
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@Req() req) {
    return {
      message: 'You have accessed a protected route!',
      user: req.user,
    };
  }
}




