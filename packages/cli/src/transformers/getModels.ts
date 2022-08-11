import {GraphQLSchema} from 'graphql';

export const getModels = (schema: GraphQLSchema) => {
  const typeMap = schema.getTypeMap();

  const models = Object.keys(typeMap).reduce(
    (prev, current) => {
      const hasModelDirective = (
        typeMap[current]?.astNode?.directives || []
      ).some((directive) => directive.name.value === 'model');
      if (hasModelDirective) {
        return {
          ...prev,
          [current]: typeMap[current],
        };
      }

      return prev;
    },
    {} as {
      [key: string]: any;
    },
  );

  return models;
};
