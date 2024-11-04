import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { IsSafeHtml } from '../../../../modules/validation';
import { MAX_LENGTHS, MIN_LENGTHS } from '../Questions.constants';

export class CreateQuestionDto {
  @Expose()
  @IsString()
  @Length(MIN_LENGTHS.questionTitle, MAX_LENGTHS.questionTitle)
  public readonly title: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  // Check that content HTML does not contain dangerous tags/elements
  @IsSafeHtml()
  public readonly contentHtml: string;

  public static example = {
    title: 'Question Title 123',
    contentHtml: '<p>Question Content HTML 123</p>',
  } as const satisfies CreateQuestionDto;
}
