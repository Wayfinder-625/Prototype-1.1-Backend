import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { StudentProfileModule } from './student-profile/student-profile.module';
import { IdeaModule } from './idea/idea.module';
import { NotificationModule } from './notification/notification.module';
import { CompetitionModule } from './competition/competition.module';
import { UserInteractionModule } from './user-interaction/user-interaction.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';

@Module({
  imports: [
    UserModule,
    StudentProfileModule,
    IdeaModule,
    NotificationModule,
    CompetitionModule,
    UserInteractionModule,
    RecommendationModule,
    AuthModule,
    QuestionnaireModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
