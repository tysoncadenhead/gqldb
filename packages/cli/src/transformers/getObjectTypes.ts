import {GraphQLSchema} from 'graphql';

export const getObjectTypes = (schema: GraphQLSchema) => {
  const typeMap = schema.getTypeMap();

  const objectTypes = Object.keys(typeMap)
    .filter((key) => {
      const hasModelDirective = (typeMap[key]?.astNode?.directives || []).some(
        (directive) => directive.name.value === 'model',
      );
      return (
        typeMap[key].constructor.name === 'GraphQLObjectType' &&
        !hasModelDirective &&
        !key.includes('__')
      );
    })
    .reduce((prev, current) => {
      return {
        ...prev,
        [current]: typeMap[current],
      };
    }, {});

  return objectTypes;
};
