import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { JsonSchemaArrayRef } from '../../../../modules/swagger';
import { PaginatedResponseDto } from '../../common';
import { QuestionDto } from './Question.dto';

export class PaginatedQuestionsDto extends PaginatedResponseDto {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @JsonSchemaArrayRef(QuestionDto)
  public readonly items: readonly QuestionDto[];

  public static override example = {
    ...PaginatedResponseDto.example,
    items: QuestionDto.arrayExample,
  } as const satisfies PaginatedQuestionsDto;
}
