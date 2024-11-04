import { Expose } from 'class-transformer';
import { IsDateString, IsInt, IsString, Length, Min } from 'class-validator';
import { MAX_LENGTHS, MIN_LENGTHS } from '../Users.constants';

export class UserDto {
  @Expose()
  @IsInt()
  @Min(1)
  public readonly id: number;

  @Expose()
  @IsString()
  @Length(MIN_LENGTHS.username, MAX_LENGTHS.username)
  public readonly username: string;

  @Expose()
  @IsDateString()
  public readonly createdAt: string;

  @Expose()
  @IsDateString()
  public readonly updatedAt: string;

  public static example = {
    id: 123,
    username: 'TestUserName123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as const satisfies UserDto;

  public static arrayExample = [
    {
      id: 123,
      username: 'TestUserName123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 234,
      username: 'TestUserName234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ] as const satisfies UserDto[];
}
