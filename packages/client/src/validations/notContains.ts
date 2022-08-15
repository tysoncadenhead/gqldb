import {IValidator} from '../types';

export const notContains: IValidator = {
  fn: (contains: string, input: string) => !input.includes(contains),
  message: (fieldName: string, contains: string) =>
    `${fieldName} must not contain ${contains}`,
};
