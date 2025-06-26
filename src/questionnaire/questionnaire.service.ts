import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';

@Injectable()
export class QuestionnaireService {
  constructor(private prisma: PrismaService) {}

  async createQuestionnaireResponse(userId: number, data: CreateQuestionnaireDto) {
    // Check if user already has a questionnaire response
    const existingResponse = await this.prisma.userQuestionnaireResponse.findUnique({
      where: { userId },
    });

    if (existingResponse) {
      throw new ConflictException('User already has a questionnaire response');
    }

    return this.prisma.userQuestionnaireResponse.create({
      data: {
        userId,
        ...data,
      },
      include: {
        user: {
          select: {
            user_id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getQuestionnaireResponse(userId: number) {
    const response = await this.prisma.userQuestionnaireResponse.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            user_id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!response) {
      throw new NotFoundException('Questionnaire response not found');
    }

    return response;
  }

  async updateQuestionnaireResponse(userId: number, data: UpdateQuestionnaireDto) {
    const existingResponse = await this.prisma.userQuestionnaireResponse.findUnique({
      where: { userId },
    });

    if (!existingResponse) {
      throw new NotFoundException('Questionnaire response not found');
    }

    return this.prisma.userQuestionnaireResponse.update({
      where: { userId },
      data,
      include: {
        user: {
          select: {
            user_id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async deleteQuestionnaireResponse(userId: number) {
    const existingResponse = await this.prisma.userQuestionnaireResponse.findUnique({
      where: { userId },
    });

    if (!existingResponse) {
      throw new NotFoundException('Questionnaire response not found');
    }

    return this.prisma.userQuestionnaireResponse.delete({
      where: { userId },
    });
  }

  async getAllQuestionnaireResponses() {
    return this.prisma.userQuestionnaireResponse.findMany({
      include: {
        user: {
          select: {
            user_id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
} 