import { IsOptional, IsString, IsDateString } from 'class-validator';

export class CompleteProfileDto {
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  location?: string;
} 