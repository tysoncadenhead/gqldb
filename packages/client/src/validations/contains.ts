import {IValidator} from '../types';

export const contains: IValidator = {
  fn: (contains: string, input: string) => input.includes(contains),
  message: (fieldName: string, contains: string) =>
    `${fieldName} must contain ${contains}`,
};
