import {ISchemaJson} from '../types';

export const getRelationships = (json: ISchemaJson): ISchemaJson => {
  return Object.keys(json).reduce((prev, current) => {
    return {
      ...prev,
      [current]: {
        ...json[current],
        fields: Object.keys(json[current].fields)
          .filter((currentField) => {
            const fieldDirectives =
              json[current].fields[currentField].directives;
            return !!fieldDirectives?.hasMany || !!fieldDirectives?.belongsTo;
          })
          .reduce((prevField, currentField) => {
            const field = json[current].fields[currentField];

            return {
              ...prevField,
              [currentField]: field,
            };
          }, {}),
      },
    };
  }, {} as ISchemaJson);
};
