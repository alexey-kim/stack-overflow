import { Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { MAX_LENGTHS, MIN_LENGTHS } from '../Users.constants';

export class LoginDto {
  @Expose()
  @IsString()
  @Length(MIN_LENGTHS.username, MAX_LENGTHS.username)
  public readonly username: string;

  @Expose()
  @IsString()
  @Length(MIN_LENGTHS.password, MAX_LENGTHS.password)
  public readonly password: string;

  public static example = {
    username: 'TestUserName123',
    password: 'P@$Sw0rD!23#'
  } as const satisfies LoginDto;
}
