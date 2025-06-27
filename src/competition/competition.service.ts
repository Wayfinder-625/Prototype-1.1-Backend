import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompetitionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.competition.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
} 