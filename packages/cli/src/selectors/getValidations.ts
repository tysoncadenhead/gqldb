import {IValidations} from 'graphqldb-types';
import {ISchemaJson} from '../types';

export const getValidations = (json: ISchemaJson): IValidations => {
  return Object.keys(json).reduce((prev, current) => {
    return {
      ...prev,
      [current]: Object.keys(json[current].fields).reduce(
        (prevField, currentField) => {
          const field = json[current].fields[currentField];
          return {
            ...prevField,
            [currentField]: field.directives?.constraint || {},
          };
        },
        {},
      ),
    };
  }, {} as IValidations);
};
