import { isNumber, isPositive } from 'class-validator';
import type { Request } from 'express';
import { Get, HttpError, JsonController, Post, Req, UseBefore } from 'routing-controllers';
import Container, { Service } from 'typedi';
import { jwtMiddleware } from '../../../modules/authentication';
import { SwaggerDocs } from '../../../modules/swagger';
import { ValidatedBody, ValidatedPathParams, ValidatedQueryParams } from '../../../modules/validation';
import { PaginatedRequestDto } from '../common';
import { UserIdRequestDto } from '../users';
import { QuestionsService } from './Questions.service';
import { CreateQuestionDto, PaginatedQuestionsDto, QuestionDto } from './dtos';

@Service()
@JsonController('/api/v1')
export class QuestionsController {
  private readonly questionsService: QuestionsService = Container.get(QuestionsService);

  @UseBefore(jwtMiddleware)
  @Post('/questions')
  @SwaggerDocs({
    summary: 'Create a new question if user exists',
    isAuthRequired: true,
    requestBodyExample: CreateQuestionDto.example,
    responseStatusCode: 201,
    responseType: QuestionDto,
    responseExample: QuestionDto.example,
  })
  public async register(
    @ValidatedBody() createQuestionDto: CreateQuestionDto,
    @Req() req: Request,
  ): Promise<QuestionDto> {
    // Validate userId
    const userId: number = (req as any).userId;
    if (!isNumber(userId) || !isPositive(userId)) {
      throw new HttpError(400, 'Invalid request');
    }

    const question: QuestionDto | null = await this.questionsService.createQuestion(createQuestionDto, userId);

    if (!question) {
      throw new HttpError(400, 'Invalid request');
    }

    return question;
  }

  @Get('/questions')
  @SwaggerDocs({
    summary: 'Get a paginated list of questions',
    parameters: [...PaginatedRequestDto.parameters],
    responseType: PaginatedQuestionsDto,
    responseExample: PaginatedQuestionsDto.example,
  })
  public async getQuestions(@ValidatedQueryParams() paginatedRequest: PaginatedRequestDto): Promise<PaginatedQuestionsDto> {
    return await this.questionsService.getQuestions(paginatedRequest);
  }

  @Get('/users/:userId/questions')
  @SwaggerDocs({
    summary: 'Get a paginated list of questions that have been created by a specific user',
    parameters: [...UserIdRequestDto.parameters, ...PaginatedRequestDto.parameters],
    responseType: PaginatedQuestionsDto,
    responseExample: PaginatedQuestionsDto.example,
  })
  public async getQuestionsByUserId(
    @ValidatedPathParams() userIdRequest: UserIdRequestDto,
    @ValidatedQueryParams() paginatedRequest: PaginatedRequestDto,
  ): Promise<PaginatedQuestionsDto> {
    return await this.questionsService.getQuestions(paginatedRequest, userIdRequest.userId);
  }
}
