import {IValidations} from 'graphqldb-types';
import {ISchemaJson} from '../types';

export const getKeys = (json: ISchemaJson): IValidations => {
  return Object.keys(json).reduce((prev, current) => {
    return {
      ...prev,
      [current]: Object.keys(json[current].fields).reduce(
        (prevField, currentField) => {
          const field = json[current].fields[currentField];
          const isKey = !!field.directives?.key;

          if (!isKey) {
            return prevField;
          }

          return {
            ...prevField,
            [currentField]: field.directives?.key,
          };
        },
        {},
      ),
    };
  }, {} as IValidations);
};
