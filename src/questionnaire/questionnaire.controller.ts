import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileCompleteGuard } from '../auth/profile-complete.guard';

@Controller('questionnaire')
@UseGuards(JwtAuthGuard, ProfileCompleteGuard)
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createQuestionnaireResponse(
    @Request() req,
    @Body() createQuestionnaireDto: CreateQuestionnaireDto,
  ) {
    return this.questionnaireService.createQuestionnaireResponse(
      req.user.user_id,
      createQuestionnaireDto,
    );
  }

  @Get('my-response')
  async getMyQuestionnaireResponse(@Request() req) {
    return this.questionnaireService.getQuestionnaireResponseByUserId(req.user.user_id);
  }

  @Get('all')
  async getAllQuestionnaireResponses() {
    return this.questionnaireService.getAllQuestionnaireResponses();
  }

  @Put()
  @UsePipes(new ValidationPipe())
  async updateQuestionnaireResponse(
    @Request() req,
    @Body() updateQuestionnaireDto: UpdateQuestionnaireDto,
  ) {
    return this.questionnaireService.updateQuestionnaireResponseByUserId(
      req.user.user_id,
      updateQuestionnaireDto,
    );
  }

  @Delete()
  async deleteQuestionnaireResponse(@Request() req) {
    return this.questionnaireService.deleteQuestionnaireResponseByUserId(req.user.user_id);
  }

  // Admin endpoints (if needed)
  @Get(':userId')
  async getQuestionnaireResponseByUserId(@Param('userId') userId: string) {
    return this.questionnaireService.getQuestionnaireResponseByUserId(parseInt(userId));
  }

  @Delete(':userId')
  async deleteQuestionnaireResponseByUserId(@Param('userId') userId: string) {
    return this.questionnaireService.deleteQuestionnaireResponseByUserId(parseInt(userId));
  }
} 