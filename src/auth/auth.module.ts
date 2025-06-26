import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OtpService } from './otp.service';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // should be set in .env
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
    UserModule,
  ],
  providers: [AuthService, OtpService, PrismaService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}




