import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class JwtDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public readonly jwt: string;

  public static example = {
    jwt: 'jwt.token',
  } as const satisfies JwtDto;
}
