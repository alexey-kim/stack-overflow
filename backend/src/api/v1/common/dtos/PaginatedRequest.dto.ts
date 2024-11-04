import { Expose } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { DEFAULT_PAGE, MAX_PAGE_SIZE } from '../Common.constants';

export class PaginatedRequestDto {
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  public readonly page: number | undefined;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  public readonly pageSize: number | undefined;

  public static example = {
    page: DEFAULT_PAGE,
    pageSize: MAX_PAGE_SIZE,
  } as const satisfies PaginatedRequestDto;

  public static parameters = [
    {
      name: 'page',
      in: 'query',
      required: false,
      example: this.example.page,
    },
    {
      name: 'pageSize',
      in: 'query',
      required: false,
      example: this.example.pageSize,
    },
  ] as const;
}
