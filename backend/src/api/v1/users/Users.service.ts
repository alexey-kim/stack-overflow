import bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { type Config, getConfig } from '../../../modules/config';
import { AppDataSource } from '../../../modules/database';
import { DefaultTransformOptions } from '../../../modules/validation';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, PaginatedRequestDto } from '../common';
import { JwtDto, LoginDto, PaginatedUsersDto } from './dtos';
import { UserEntity } from './entities';

@Service()
export class UsersService {
  private readonly usersRepository: Repository<UserEntity> = AppDataSource.getRepository(UserEntity);

  private config: Config = getConfig();

  /**
   * Method to generate a JWT token for user.
   * @returns {JwtDto} Object with jwt token.
   */
  private getJwtDto(id: number, username: string): JwtDto {
    const jwtToken: string = jwt.sign(
      { userId: id, username },
      this.config.JWT_SECRET,
      { expiresIn: this.config.JWT_EXPIRATION },
    );

    return { jwt: jwtToken };
  }

  /**
   * Method to register a new user if there are no existing users with the same user name.
   * @returns {JwtDto | null} Object with jwt token for a successfully registered user. Otherwise, null value is returned.
   */
  public async register(loginDto: LoginDto): Promise<JwtDto | null> {
    const { username, password } = loginDto;

    // Check if a user with the provided user name already exists
    const isExistingUser: boolean = await this.usersRepository.exists({ where: { username } });
    if (isExistingUser) {
      return null;
    }

    const newUser: UserEntity = this.usersRepository.create({ username, password });
    await this.usersRepository.save(newUser);

    return this.getJwtDto(newUser.id, newUser.username);
  }

  /**
   * Method to login an existing user with user name and password.
   * @returns {JwtDto | null} Object with jwt token for a successfully logged-in user. Otherwise, null value is returned.
   */
  public async login(loginDto: LoginDto): Promise<JwtDto | null> {
    const { username, password } = loginDto;

    const user: UserEntity | null = await this.usersRepository.findOne({ where: { username } });

    // User with the provided user name does not exist
    if (!user) {
      return null;
    }

    // Compare saved password hash to the provided password
    const isLoginValid: boolean = await bcrypt.compare(password, user.password);
    if (!isLoginValid) {
      return null;
    }

    return this.getJwtDto(user.id, user.username);
  }

  /**
   * Method to get a paginated list of users.
   * @returns {PaginatedUsersDto} Paginated response with users.
   */
  public async getUsers(paginatedRequest: PaginatedRequestDto): Promise<PaginatedUsersDto> {
    const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE } = paginatedRequest;

    const offset: number = (page - 1) * pageSize;

    const [users, usersCount]: [UserEntity[], number] = await this.usersRepository
      .findAndCount({
        order: { username: 'ASC' },
        skip: offset,
        take: pageSize
      });

    const pagesTotal: number = Math.ceil(usersCount / pageSize);

    return plainToInstance(PaginatedUsersDto, {
      page,
      pageSize,
      pagesTotal,
      itemsTotal: usersCount,
      items: users
    }, DefaultTransformOptions);
  }
}
