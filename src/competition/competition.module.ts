import { Module } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { CompetitionController } from './competition.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserInteractionModule } from '../user-interaction/user-interaction.module';

@Module({
  imports: [PrismaModule, UserInteractionModule],
  controllers: [CompetitionController],
  providers: [CompetitionService],
  exports: [CompetitionService],
})
export class CompetitionModule {} 