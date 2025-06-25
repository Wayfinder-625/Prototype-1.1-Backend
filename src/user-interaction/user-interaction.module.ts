import { Module } from '@nestjs/common';
import { UserInteractionService } from './user-interaction.service';
import { UserInteractionController } from './user-interaction.controller';

@Module({
  providers: [UserInteractionService],
  controllers: [UserInteractionController]
})
export class UserInteractionModule {}
