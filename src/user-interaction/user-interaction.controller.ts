import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  UseGuards, 
  Request,
  Param,
  ParseIntPipe 
} from '@nestjs/common';
import { UserInteractionService } from './user-interaction.service';
import { CreateCompetitionInteractionDto } from './dto/create-competition-interaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-interaction')
export class UserInteractionController {
  constructor(private readonly userInteractionService: UserInteractionService) {}

  @Post('competition')
  @UseGuards(JwtAuthGuard)
  async createCompetitionInteraction(
    @Request() req,
    @Body() createCompetitionInteractionDto: CreateCompetitionInteractionDto,
  ) {
    return this.userInteractionService.createCompetitionInteraction(
      req.user.user_id,
      createCompetitionInteractionDto,
    );
  }

  @Get('competition/my-interactions')
  @UseGuards(JwtAuthGuard)
  async getMyCompetitionInteractions(@Request() req) {
    return this.userInteractionService.getUserCompetitionInteractions(
      req.user.user_id,
    );
  }

  @Get('competition/stats')
  @UseGuards(JwtAuthGuard)
  async getMyCompetitionStats(@Request() req) {
    return this.userInteractionService.getCompetitionInteractionStats(
      req.user.user_id,
    );
  }

  @Get('competition/analytics')
  @UseGuards(JwtAuthGuard)
  async getCompetitionAnalytics() {
    return this.userInteractionService.getCompetitionInteractionAnalytics();
  }

  @Get('competition/user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserCompetitionInteractions(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.userInteractionService.getUserCompetitionInteractions(userId);
  }

  @Get('competition/user/:userId/stats')
  @UseGuards(JwtAuthGuard)
  async getUserCompetitionStats(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.userInteractionService.getCompetitionInteractionStats(userId);
  }
}
