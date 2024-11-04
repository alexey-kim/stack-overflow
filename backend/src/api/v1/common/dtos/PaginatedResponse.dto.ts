import { Expose } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { DEFAULT_PAGE, MAX_PAGE_SIZE } from '../Common.constants';

export abstract class PaginatedResponseDto {
  @Expose()
  @IsInt()
  @Min(1)
  public readonly page: number;

  @Expose()
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  public readonly pageSize: number;

  @Expose()
  @IsInt()
  @Min(0)
  public readonly pagesTotal: number;

  @Expose()
  @IsInt()
  @Min(0)
  public readonly itemsTotal: number;

  public static example = {
    page: DEFAULT_PAGE,
    pageSize: MAX_PAGE_SIZE,
    pagesTotal: Math.ceil(20000 / MAX_PAGE_SIZE),
    itemsTotal: 20000,
  } as const satisfies PaginatedResponseDto;
}
