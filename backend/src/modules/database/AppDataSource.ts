import { DataSource } from 'typeorm';
import { type Config, getConfig } from '../config';

const config: Config = getConfig();

/** Data source for Postgresql */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_DATABASE,
  entities: [__dirname + `/../../api/v1/**/entities/*.entity.${config.FILE_EXT}`],
  migrations: [__dirname + `/migrations/*.${config.FILE_EXT}`],
  synchronize: config.NODE_ENV === 'development',
  logging: config.IS_DB_LOGGING_ENABLED,
});
