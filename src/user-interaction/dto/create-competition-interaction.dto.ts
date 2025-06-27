import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateCompetitionInteractionDto {
  @IsString()
  competitionId: string;

  @IsString()
  interactionType: string; // 'click', 'view', 'apply', etc.

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>; // Additional data like source, duration, etc.
} 