import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { UserInteractionService } from '../user-interaction/user-interaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('competitions')
export class CompetitionController {
  constructor(
    private readonly competitionService: CompetitionService,
    private readonly userInteractionService: UserInteractionService,
  ) {}

  @Get()
  async findAll() {
    return this.competitionService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Request() req) {
    // Track the interaction when user views a specific competition
    await this.userInteractionService.createCompetitionInteraction(
      req.user.user_id,
      {
        competitionId: id,
        interactionType: 'view',
        metadata: {
          source: 'competition_detail_page',
          timestamp: new Date().toISOString(),
        },
      },
    );

    return this.competitionService.findOne(id);
  }
} 