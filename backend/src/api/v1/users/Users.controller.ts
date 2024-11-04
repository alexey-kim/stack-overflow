import { Get, HttpError, JsonController, Post, UseBefore } from 'routing-controllers';
import Container, { Service } from 'typedi';
import { jwtMiddleware } from '../../../modules/authentication';
import { SwaggerDocs } from '../../../modules/swagger';
import { ValidatedBody, ValidatedQueryParams } from '../../../modules/validation';
import { PaginatedRequestDto } from '../common';
import { JwtDto, LoginDto, PaginatedUsersDto } from './dtos';
import { UsersService } from './Users.service';

@Service()
@JsonController('/api/v1/users')
export class UsersController {
  private readonly usersService: UsersService = Container.get(UsersService);

  @Post('/')
  @SwaggerDocs({
    summary: 'Register a new user if there are no existing users with the same user name',
    requestBodyExample: LoginDto.example,
    responseStatusCode: 201,
    responseType: JwtDto,
    responseExample: JwtDto.example,
  })
  public async register(@ValidatedBody() loginDto: LoginDto): Promise<JwtDto> {
    const jwtDto: JwtDto | null = await this.usersService.register(loginDto);

    if (!jwtDto) {
      throw new HttpError(400, 'Invalid username or password');
    }

    return jwtDto;
  }

  @Post('/login')
  @SwaggerDocs({
    summary: 'Login an existing user with user name and password',
    requestBodyExample: LoginDto.example,
    responseType: JwtDto,
    responseExample: JwtDto.example,
  })
  public async login(@ValidatedBody() loginDto: LoginDto): Promise<JwtDto> {
    const jwtDto: JwtDto | null = await this.usersService.login(loginDto);

    if (!jwtDto) {
      throw new HttpError(401, 'Invalid username or password');
    }

    return jwtDto;
  }

  // TODO: Protect with role based authorization (e.g. only Admins should be able to call this endpoint)
  @UseBefore(jwtMiddleware)
  @Get('/')
  @SwaggerDocs({
    summary: 'Get a paginated list of users',
    isAuthRequired: true,
    parameters: [...PaginatedRequestDto.parameters],
    responseType: PaginatedUsersDto,
    responseExample: PaginatedUsersDto.example,
  })
  public async getUsers(@ValidatedQueryParams() paginatedRequest: PaginatedRequestDto): Promise<PaginatedUsersDto> {
    return await this.usersService.getUsers(paginatedRequest);
  }
}
