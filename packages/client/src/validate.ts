import {IValidations} from './types';
import {validateField} from './validateField';

export const validate = (validations: IValidations, input) => {
  Object.keys(validations).forEach((field) =>
    validateField(field, validations[field], input[field]),
  );

  return true;
};
