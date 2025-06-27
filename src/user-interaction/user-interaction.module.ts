import { Module } from '@nestjs/common';
import { UserInteractionService } from './user-interaction.service';
import { UserInteractionController } from './user-interaction.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserInteractionService],
  controllers: [UserInteractionController],
  exports: [UserInteractionService]
})
export class UserInteractionModule {}
