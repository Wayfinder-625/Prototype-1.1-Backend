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




