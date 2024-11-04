import { plainToInstance } from 'class-transformer';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { AppDataSource } from '../../../modules/database';
import { DefaultTransformOptions } from '../../../modules/validation';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, PaginatedRequestDto } from '../common';
import { UserEntity } from '../users';
import { CreateQuestionDto, PaginatedQuestionsDto, QuestionDto } from './dtos';
import { QuestionEntity } from './entities';

@Service()
export class QuestionsService {
  private readonly usersRepository: Repository<UserEntity> = AppDataSource.getRepository(UserEntity);
  private readonly questionsRepository: Repository<QuestionEntity> = AppDataSource.getRepository(QuestionEntity);

  /**
   * Method to create a new question if user exists.
   * @returns {QuestionDto | null} Created question for a successfully saved question. Otherwise, null value is returned.
   */
  public async createQuestion(createQuestionDto: CreateQuestionDto, userId: number): Promise<QuestionDto | null> {
    const { title, contentHtml } = createQuestionDto;

    // Check if a user with the provided Id exists
    const user: UserEntity | null = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      return null;
    }

    const newQuestion: QuestionEntity = this.questionsRepository.create({ title, contentHtml, user });
    const savedQuestion: QuestionEntity = await this.questionsRepository.save(newQuestion);

    return plainToInstance(QuestionDto, savedQuestion, DefaultTransformOptions);
  }

  /**
   * Method to get a paginated list of questions.
   * If userId is provided then return questions that have been created by that user.
   * @returns {PaginatedQuestionsDto} Paginated response with questions.
   */
  public async getQuestions(paginatedRequest: PaginatedRequestDto, userId?: number): Promise<PaginatedQuestionsDto> {
    const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE } = paginatedRequest;

    const offset: number = (page - 1) * pageSize;

    const [questions, questionsCount]: [QuestionEntity[], number] = await this.questionsRepository
      .findAndCount({
        // Conditionally filter by userId if it is provided
        ...(userId ? { where: { user: { id: userId } } } : {}),
        relations: ['user'],
        order: { createdAt: 'DESC' },
        skip: offset,
        take: pageSize
      });

    const pagesTotal: number = Math.ceil(questionsCount / pageSize);

    return plainToInstance(PaginatedQuestionsDto, {
      page,
      pageSize,
      pagesTotal,
      itemsTotal: questionsCount,
      items: questions
    }, DefaultTransformOptions);
  }
}
