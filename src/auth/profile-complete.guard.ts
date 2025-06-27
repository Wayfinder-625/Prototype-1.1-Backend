import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class ProfileCompleteGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (req.user && !req.user.isProfileComplete) {
      throw new ForbiddenException('Profile is incomplete. Please complete your profile.');
    }
    return true;
  }
} 