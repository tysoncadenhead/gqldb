import {Flattened, FlattenedField, IModels} from '@graphqldb/types';
import {relationshipTypes, typeMap, generatedTypes} from './constants';

export const flatten = (models: IModels): Flattened => {
  return Object.keys(models).reduce((prev, current) => {
    const model = models[current];

    return {
      ...prev,
      [current]: Object.keys(model._fields)
        .filter((key) => {
          return !(model._fields[key].astNode.directives || []).find(
            (directive) =>
              [...relationshipTypes, ...generatedTypes].includes(
                directive.name.value,
              ),
          );
        })
        .map((key) => {
          const loc = model._fields[key].astNode.type.loc;
          const isArray = loc.startToken.kind === '[';
          const startToken = isArray
            ? loc.startToken.next.value
            : loc.startToken.value;
          const originalType = startToken;
          const type = typeMap[startToken] || `I${startToken}`;
          const required = loc.endToken.kind === '!';

          return {
            key,
            type,
            required,
            originalType,
            isArray,
            generated: !!(model._fields[key].astNode.directives || []).find(
              (directive) => directive.name.value === 'generated',
            ),
          } as FlattenedField;
        }),
    };
  }, {});
};
