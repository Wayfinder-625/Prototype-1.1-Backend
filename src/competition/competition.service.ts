import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompetitionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.competition.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
    });

    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    return competition;
  }
} 