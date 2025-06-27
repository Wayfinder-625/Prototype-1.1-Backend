import { Controller, Post, Body, UseGuards, Req, Get, UseInterceptors, ClassSerializerInterceptor, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OtpService } from './otp.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { Response } from 'express';
import { ProfileCompleteGuard } from './profile-complete.guard';

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

  @Post('verify-registration')
  async verifyRegistration(@Body() body: { email: string; code: string }) {
    return this.otpService.verifyRegistrationOtp(body.email, body.code);
  }

  // Google OAuth endpoints
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // This will redirect to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const result = await this.authService.validateGoogleUser(req.user);

    // Ensure no double slashes in the URL
    const frontendUrl = (process.env.FRONTEND_URL || 'https://project-wayfinder.netlify.app').replace(/\/$/, '');
    const redirectUrl = new URL(frontendUrl + '/google-redirect');

    redirectUrl.searchParams.set('accessToken', result.accessToken);
    redirectUrl.searchParams.set('refreshToken', result.refreshToken);
    redirectUrl.searchParams.set('email', result.user.email);
    redirectUrl.searchParams.set('firstName', result.user.firstName || '');
    redirectUrl.searchParams.set('lastName', result.user.lastName || '');
    redirectUrl.searchParams.set('requiresProfileCompletion', String(result.requiresProfileCompletion));
    if (result.missingFields) {
      redirectUrl.searchParams.set('missingFields', result.missingFields.join(','));
    }

    // Log the redirect URL for debugging
    console.log('Redirecting to:', redirectUrl.toString());

    return res.redirect(redirectUrl.toString());
  }

  @Post('complete-profile')
  @UseGuards(JwtAuthGuard)
  async completeProfile(
    @Req() req,
    @Body() profileData: CompleteProfileDto
  ) {
    // Convert dateOfBirth string to Date if provided
    const data = {
      ...profileData,
      dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined,
    };
    return this.authService.completeProfile(req.user.user_id, data);
  }

  // ✅ Add this route to test JWT protection
  @UseGuards(JwtAuthGuard, ProfileCompleteGuard)
  @Get('protected')
  getProtected(@Req() req) {
    return {
      message: 'You have accessed a protected route!',
      user: req.user,
    };
  }
}




