import {IValidator} from '../types';

export const min: IValidator = {
  fn: (max: number, input: number) => max <= input,
  message: (fieldName: string, max: number) =>
    `${fieldName} must be ${max} or more`,
};
