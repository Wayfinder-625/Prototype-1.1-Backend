import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async getAndStoreRecommendations(userId: number, questionnaireData: any) {
    try {
      console.log('Starting recommendation process for user:', userId);
      
      // 1. Fetch all competitions from the database
      const competitions = await this.prisma.competition.findMany();
      
      if (!competitions || competitions.length === 0) {
        throw new BadRequestException('No competitions found in database');
      }

      console.log(`Fetched ${competitions.length} competitions for ML processing`);
      console.log('Sample competition:', competitions[0]);

      // 2. Prepare the request payload
      const requestPayload = {
        user_id: `user-${userId}`,
        competitions: competitions,
        ...questionnaireData,
      };

      console.log('Request payload structure:', {
        user_id: requestPayload.user_id,
        competitions_count: requestPayload.competitions.length,
        questionnaire_keys: Object.keys(questionnaireData)
      });

      const fastApiUrl = process.env.RECOMMENDER_URL || 'http://localhost:8000/recommend';
      console.log('Calling FastAPI at:', fastApiUrl);

      // 3. Call FastAPI with competitions data
      const response = await firstValueFrom(
        this.httpService.post(fastApiUrl, requestPayload)
      );
      
      console.log('FastAPI response received:', {
        status: response.status,
        data_keys: Object.keys(response.data)
      });

      const recommendations = response.data.recommendations;
      console.log(`Received ${recommendations.length} recommendations from FastAPI`);

      // 4. Store each recommendation in the DB
      for (const rec of recommendations) {
        await this.prisma.recommendedCompetition.create({
          data: {
            userId,
            competitionId: rec.competition_id,
            fitScore: rec.fit_score,
            mlSimilarity: rec.ml_similarity,
            textSimilarity: rec.text_similarity,
            skillsSimilarity: rec.skills_similarity,
            fitReasons: rec.fit_reasons,
            modelType: response.data.ml_insights.model_type,
            scoringPriority: response.data.ml_insights.scoring_priority,
            featuresUsed: response.data.ml_insights.features_used,
            similarityRange: response.data.ml_insights.similarity_range,
            debugInfo: response.data.ml_insights.debug_info,
            generatedAt: new Date(response.data.generated_at),
          },
        });
      }

      console.log('Successfully stored all recommendations in database');

      // 5. Return the recommendations to the frontend
      return response.data;
    } catch (error) {
      console.error('Error in getAndStoreRecommendations:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw new BadRequestException('Failed to get/store recommendations from ML model');
    }
  }

  async getUserRecommendations(userId: number) {
    return this.prisma.recommendedCompetition.findMany({
      where: { userId },
      include: { competition: true },
      orderBy: { generatedAt: 'desc' },
    });
  }
}
