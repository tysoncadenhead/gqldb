import {buildSchema} from 'graphql';
import {customDirectives} from '../customDirectives';
import {ISchemaJson} from '../types';

const schemaDirectivesToJson = (directives) => {
  return directives.reduce((prevDirectives, directive) => {
    return {
      ...prevDirectives,
      [directive.name.value]: directive.arguments.reduce(
        (prevArgs, arg: any) => {
          return {
            ...prevArgs,
            [arg.name.value]:
              arg?.value?.value ||
              (arg?.value?.values || []).map((value) => {
                return value.fields.reduce((prevField, field) => {
                  return {
                    ...prevField,
                    [field.name.value]: field.value.value,
                  };
                }, {});
              }) ||
              null,
          };
        },
        {},
      ),
    };
  }, {});
};

export const schemaToJson = (schemaString: string): ISchemaJson => {
  const combinedSchema = `${customDirectives}
  ${schemaString}`;
  const schema = buildSchema(combinedSchema);
  const typeMap = schema.getTypeMap();
  return Object.keys(typeMap)
    .filter((key) => {
      return (
        typeMap[key].constructor.name === 'GraphQLObjectType' &&
        !key.includes('__')
      );
    })
    .reduce((prev, current) => {
      // Directives
      const directives = schemaDirectivesToJson(
        typeMap[current]?.astNode?.directives || [],
      );

      const currentTypeMap = typeMap[current] as any;

      // Fields
      const fields = currentTypeMap.astNode.fields.reduce(
        (prevFields, field) => {
          const fieldType =
            field?.type?.name?.value ||
            field?.type?.type?.name?.value ||
            (!field?.type?.loc?.startToken?.value
              ? field?.type?.loc?.startToken?.next?.value
              : field?.type?.loc?.startToken?.value);

          const isArray =
            field.type.kind === 'ListType' ||
            field?.type?.loc?.startToken?.kind === '[';

          const required =
            field.type.loc.startToken.kind === '!' ||
            field.type.loc.endToken.kind === '!';

          return {
            ...prevFields,
            [field.name.value]: {
              type: fieldType,
              isArray,
              required,
              directives: schemaDirectivesToJson(field.directives || []),
            },
          };
        },
        {},
      );

      return {
        ...prev,
        [current]: {
          directives,
          fields,
        },
      };
    }, {} as ISchemaJson);
};
