import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { JsonSchemaArrayRef } from '../../../../modules/swagger';
import { PaginatedResponseDto } from '../../common';
import { UserDto } from './User.dto';

export class PaginatedUsersDto extends PaginatedResponseDto {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  @JsonSchemaArrayRef(UserDto)
  public readonly items: readonly UserDto[];

  public static override example = {
    ...PaginatedResponseDto.example,
    items: UserDto.arrayExample,
  } as const satisfies PaginatedUsersDto;
}
