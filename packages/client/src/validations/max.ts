import {IValidator} from '../types';

export const max: IValidator = {
  fn: (min: number, input: number) => min >= input,
  message: (fieldName: string, min: number) =>
    `${fieldName} must be ${min} or less`,
};
