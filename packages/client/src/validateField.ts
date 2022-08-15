import {IValidation} from './types';
import * as validationTypes from './validations';

export const validateField = (
  fieldName: string,
  validations: IValidation,
  value,
) => {
  Object.keys(validations).forEach((key) => {
    if (!validationTypes?.[key]?.fn(validations[key], value)) {
      throw new Error(
        validationTypes?.[key]?.message(fieldName, validations[key]),
      );
    }
  });
  return true;
};
