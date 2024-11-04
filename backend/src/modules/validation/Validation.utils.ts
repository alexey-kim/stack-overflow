import { Body, Params, QueryParams } from 'routing-controllers';
import { DefaultTransformOptions } from './Validation.constants';

export const ValidatedBody = (): Function => {
  return Body({
    required: true,
    transform: DefaultTransformOptions,
    validate: true,
  });
};

export const ValidatedQueryParams = (params?: {
  isRequired?: boolean;
}): Function => {
  const { isRequired = false } = params ?? {};

  return QueryParams({
    required: isRequired,
    transform: DefaultTransformOptions,
    validate: true,
  });
};

export const ValidatedPathParams = (): Function => {
  return Params({
    required: true,
    transform: DefaultTransformOptions,
    validate: true,
  });
};
