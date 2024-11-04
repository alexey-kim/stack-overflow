import { Expose, Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsString, Length, Min, ValidateNested } from 'class-validator';
import { IsSafeHtml } from '../../../../modules/validation';
import { UserDto } from '../../users';
import { MAX_LENGTHS, MIN_LENGTHS } from '../Questions.constants';

export class QuestionDto {
  @Expose()
  @IsInt()
  @Min(1)
  public readonly id: number;

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

  @Expose()
  @IsDateString()
  public readonly createdAt: string;

  @Expose()
  @IsDateString()
  public readonly updatedAt: string;

  @Expose()
  @ValidateNested()
  @Type(() => UserDto)
  public readonly user: UserDto;

  public static example = {
    id: 123,
    title: 'Question Title 123',
    contentHtml: '<p>Question Content HTML 123</p>',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: UserDto.example,
  } as const satisfies QuestionDto;

  public static arrayExample = [
    {
      id: 123,
      title: 'Question Title 123',
      contentHtml: '<p>Question Content HTML 123</p>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: UserDto.example,
    },
    {
      id: 234,
      title: 'Question Title 234',
      contentHtml: '<p>Question Content HTML 234</p>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: UserDto.example,
    }
  ] as const satisfies QuestionDto[];
}
