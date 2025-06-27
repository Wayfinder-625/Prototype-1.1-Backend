import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
       clientID: '301245041185-eihdb26ldmnk3ahbj77s1i98dvicepao.apps.googleusercontent.com', // Replace with your actual Google Client ID
      clientSecret: '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', // Replace with your actual Google Client Secret
      callbackURL: 'https://ec2-43-205-113-7.ap-south-1.compute.amazonaws.com/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('Google profile:', JSON.stringify(profile, null, 2));
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    
    done(null, user);
  }
} 
