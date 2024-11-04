import { validateSync, type ValidationError } from 'class-validator';
import dotenv from 'dotenv';
import { Config } from './Config';

let config: Config | undefined;

/**
 * Function that returns a validated config object.
 * @throws {Error} If validation of the config object fails, e.g. if mandatory values are missing or invalid.
 */
export const getConfig = (): Config => {
  if (config) {
    return config;
  }

  dotenv.config();

  const newConfig = new Config();

  // Perform validation of the config object.
  // Do not skip validation of all properties that are null or undefined.
  const validationErrors: ValidationError[] = validateSync(newConfig, { skipMissingProperties: false });
  if (validationErrors.length) {
    throw new Error(`Validation errors in the app configuration: ${JSON.stringify(validationErrors)}`);
  }

  config = newConfig;

  return config;
};
