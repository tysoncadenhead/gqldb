import {IValidator} from '../types';

export const minLength: IValidator = {
  fn: (length: number, input: string) => input.length >= length,
  message: (fieldName: string, length: number) =>
    `${fieldName} must be at least ${length} characters long`,
};
