import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserInteractionModule } from './user-interaction/user-interaction.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { CompetitionModule } from './competition/competition.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    UserInteractionModule,
    RecommendationModule,
    AuthModule,
    QuestionnaireModule,
    CompetitionModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
