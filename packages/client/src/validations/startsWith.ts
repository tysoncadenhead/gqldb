import {IValidator} from '../types';

export const startsWith: IValidator = {
  fn: (startsWith: string, input: string) => input.startsWith(startsWith),
  message: (fieldName: string, startsWith: string) =>
    `${fieldName} must start with ${startsWith}`,
};
