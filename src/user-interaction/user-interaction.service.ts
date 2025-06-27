import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompetitionInteractionDto } from './dto/create-competition-interaction.dto';

@Injectable()
export class UserInteractionService {
  constructor(private readonly prisma: PrismaService) {}

  async createCompetitionInteraction(
    userId: number,
    createCompetitionInteractionDto: CreateCompetitionInteractionDto,
  ) {
    // Verify that the competition exists
    const competition = await this.prisma.competition.findUnique({
      where: { id: createCompetitionInteractionDto.competitionId },
    });

    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    return this.prisma.competitionInteraction.create({
      data: {
        userId,
        competitionId: createCompetitionInteractionDto.competitionId,
        interactionType: createCompetitionInteractionDto.interactionType,
        metadata: createCompetitionInteractionDto.metadata || {},
      },
      include: {
        competition: {
          select: {
            id: true,
            title: true,
            domain: true,
          },
        },
      },
    });
  }

  async getUserCompetitionInteractions(userId: number) {
    return this.prisma.competitionInteraction.findMany({
      where: { userId },
      include: {
        competition: {
          select: {
            id: true,
            title: true,
            domain: true,
            tags: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCompetitionInteractionStats(userId: number) {
    const interactions = await this.prisma.competitionInteraction.findMany({
      where: { userId },
      include: {
        competition: {
          select: {
            id: true,
            title: true,
            domain: true,
            tags: true,
          },
        },
      },
    });

    // Group by interaction type
    const statsByType = interactions.reduce((acc, interaction) => {
      const type = interaction.interactionType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(interaction);
      return acc;
    }, {} as Record<string, typeof interactions>);

    // Get unique competitions interacted with
    const uniqueCompetitions = new Set(
      interactions.map((interaction) => interaction.competitionId),
    );

    // Get domain preferences
    const domainStats = interactions.reduce((acc, interaction) => {
      const domain = interaction.competition.domain;
      acc[domain] = (acc[domain] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalInteractions: interactions.length,
      uniqueCompetitions: uniqueCompetitions.size,
      statsByType,
      domainStats,
      recentInteractions: interactions.slice(0, 10), // Last 10 interactions
    };
  }

  async getCompetitionInteractionAnalytics() {
    // Get overall analytics across all users
    const totalInteractions = await this.prisma.competitionInteraction.count();
    
    const interactionsByType = await this.prisma.competitionInteraction.groupBy({
      by: ['interactionType'],
      _count: {
        interactionType: true,
      },
    });

    const mostInteractedCompetitions = await this.prisma.competitionInteraction.groupBy({
      by: ['competitionId'],
      _count: {
        competitionId: true,
      },
      orderBy: {
        _count: {
          competitionId: 'desc',
        },
      },
      take: 10,
    });

    const mostActiveUsers = await this.prisma.competitionInteraction.groupBy({
      by: ['userId'],
      _count: {
        userId: true,
      },
      orderBy: {
        _count: {
          userId: 'desc',
        },
      },
      take: 10,
    });

    return {
      totalInteractions,
      interactionsByType,
      mostInteractedCompetitions,
      mostActiveUsers,
    };
  }
}
