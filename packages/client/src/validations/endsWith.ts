import {IValidator} from '../types';

export const endsWith: IValidator = {
  fn: (endsWith: string, input: string) => input.endsWith(endsWith),
  message: (fieldName: string, endsWith: string) =>
    `${fieldName} must end with ${endsWith}`,
};
