import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async getAndStoreRecommendations(@Request() req, @Body() questionnaireData: any) {
    const userId = req.user.user_id;
    return this.recommendationService.getAndStoreRecommendations(userId, questionnaireData);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUserRecommendations(@Request() req) {
    const userId = req.user.user_id;
    return this.recommendationService.getUserRecommendations(userId);
  }
}
