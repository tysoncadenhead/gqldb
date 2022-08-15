import {IModels} from '@graphqldb/types';

export const getValidations = (models: IModels) => {
  return Object.keys(models).reduce((prev, current) => {
    const model = models[current];

    return {
      ...prev,
      [model.name]: Object.keys(model._fields).reduce(
        (prevField, currentField) => {
          const validation = (
            model._fields[currentField].astNode.directives || []
          ).find((directive) => directive.name.value === 'constraint');

          if (!validation) {
            return {
              ...prevField,
              [currentField]: {},
            };
          }

          return {
            ...prevField,
            [currentField]: validation.arguments.reduce((prevArg, arg) => {
              return {
                ...prevArg,
                [arg.name.value]: arg.value.value,
              };
            }, {}),
          };
        },
        {},
      ),
    };
  }, {});
};
