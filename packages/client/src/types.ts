export interface IValidation {
  [validation: string]: string | number | boolean;
}

export interface IValidations {
  [field: string]: IValidation;
}

export interface IValidator {
  fn: (a: number | string, b: number | string) => boolean;
  message: (fieldName: string, value: number | string) => string;
}
