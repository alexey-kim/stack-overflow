import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { NodeEnvs } from './Config.constants';
import { NodeEnv } from './Config.types';

export class Config {
  constructor() {
    this.NODE_ENV = process.env.NODE_ENV as NodeEnv;

    this.HOST = process.env.HOST || '';
    this.PORT = Number(process.env.PORT) || 0;

    this.DB_HOST = process.env.DB_HOST || '';
    this.DB_PORT = Number(process.env.DB_PORT) || 0;
    this.DB_USERNAME = process.env.DB_USERNAME || '';
    this.DB_PASSWORD = process.env.DB_PASSWORD || '';
    this.DB_DATABASE = process.env.DB_DATABASE || '';
    this.IS_DB_LOGGING_ENABLED = (process.env.IS_DB_LOGGING_ENABLED || '') === 'true';

    this.JWT_SECRET = process.env.JWT_SECRET || '';
    this.JWT_EXPIRATION = Number(process.env.JWT_EXPIRATION) || 0;

    this.FILE_EXT = process.env.FILE_EXT || '';
  }

  @IsString()
  @IsIn(NodeEnvs)
  public readonly NODE_ENV: NodeEnv;

  @IsString()
  @IsNotEmpty()
  public readonly HOST: string;

  @IsInt()
  @Min(1)
  public readonly PORT: number;

  @IsString()
  @IsNotEmpty()
  public readonly DB_HOST: string;

  @IsInt()
  @Min(1)
  public readonly DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  public readonly DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  public readonly DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  public readonly DB_DATABASE: string;

  @IsBoolean()
  public readonly IS_DB_LOGGING_ENABLED: boolean;

  @IsString()
  @IsNotEmpty()
  public readonly JWT_SECRET: string;

  @IsInt()
  @Min(1)
  public readonly JWT_EXPIRATION: number;

  @IsString()
  @IsNotEmpty()
  public readonly FILE_EXT: string;
}
