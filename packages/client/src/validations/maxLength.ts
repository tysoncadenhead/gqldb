import {IValidator} from '../types';

export const maxLength: IValidator = {
  fn: (length: number, input: string) => input.length <= length,
  message: (fieldName: string, length: number) =>
    `${fieldName} must be no more than ${length} characters long`,
};
