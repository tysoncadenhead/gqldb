import {IValidator} from '../types';

export const pattern: IValidator = {
  fn: (pattern: string, input: string) => new RegExp(pattern).test(input),
  message: (fieldName: string, pattern: string) =>
    `${fieldName} must match the pattern ${pattern}`,
};
