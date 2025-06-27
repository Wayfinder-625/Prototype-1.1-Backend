import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';

@Injectable()
export class QuestionnaireService {
  constructor(private prisma: PrismaService) {}

  async createQuestionnaireResponse(userId: number, data: CreateQuestionnaireDto) {
    // Check if user already has a questionnaire response
    const existingResponse = await this.prisma.userQuestionnaireResponse.findFirst({
      where: { userId },
    });

    if (existingResponse) {
      throw new ConflictException('User already has a questionnaire response');
    }

    return this.prisma.userQuestionnaireResponse.create({
      data: {
        userId,
        ...data,
        keySkills: Array.isArray(data.keySkills)
          ? data.keySkills
          : (typeof data.keySkills === 'string' && data.keySkills
              ? (data.keySkills as string).split(',').map((s: string) => s.trim())
              : []),
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

  async getQuestionnaireResponse(id: number) {
    const response = await this.prisma.userQuestionnaireResponse.findUnique({
      where: { id },
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

  async getQuestionnaireResponseByUserId(userId: number) {
    const response = await this.prisma.userQuestionnaireResponse.findFirst({
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

  async updateQuestionnaireResponse(id: number, data: UpdateQuestionnaireDto) {
    const existingResponse = await this.prisma.userQuestionnaireResponse.findUnique({
      where: { id },
    });

    if (!existingResponse) {
      throw new NotFoundException('Questionnaire response not found');
    }

    return this.prisma.userQuestionnaireResponse.update({
      where: { id },
      data: {
        ...data,
        keySkills: Array.isArray(data.keySkills)
          ? data.keySkills
          : (typeof data.keySkills === 'string' && data.keySkills
              ? (data.keySkills as string).split(',').map((s: string) => s.trim())
              : []),
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

  async updateQuestionnaireResponseByUserId(userId: number, data: UpdateQuestionnaireDto) {
    const existingResponse = await this.prisma.userQuestionnaireResponse.findFirst({
      where: { userId },
    });

    if (!existingResponse) {
      throw new NotFoundException('Questionnaire response not found');
    }

    return this.prisma.userQuestionnaireResponse.update({
      where: { id: existingResponse.id },
      data: {
        ...data,
        keySkills: Array.isArray(data.keySkills)
          ? data.keySkills
          : (typeof data.keySkills === 'string' && data.keySkills
              ? (data.keySkills as string).split(',').map((s: string) => s.trim())
              : []),
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

  async deleteQuestionnaireResponse(id: number) {
    const existingResponse = await this.prisma.userQuestionnaireResponse.findUnique({
      where: { id },
    });

    if (!existingResponse) {
      throw new NotFoundException('Questionnaire response not found');
    }

    return this.prisma.userQuestionnaireResponse.delete({
      where: { id },
    });
  }

  async deleteQuestionnaireResponseByUserId(userId: number) {
    const existingResponse = await this.prisma.userQuestionnaireResponse.findFirst({
      where: { userId },
    });

    if (!existingResponse) {
      throw new NotFoundException('Questionnaire response not found');
    }

    return this.prisma.userQuestionnaireResponse.delete({
      where: { id: existingResponse.id },
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