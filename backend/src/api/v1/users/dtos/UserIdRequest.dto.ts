import { Expose } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class UserIdRequestDto {
  @Expose()
  @IsInt()
  @Min(1)
  public readonly userId: number;

  public static example = {
    userId: 123,
  } as const satisfies UserIdRequestDto;

  public static parameters = [
    {
      name: 'userId',
      in: 'path',
      required: true,
      example: this.example.userId,
    },
  ] as const;
}
