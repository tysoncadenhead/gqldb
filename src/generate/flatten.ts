import {Flattened, FlattenedField, IModels} from '../types';
import {relationshipTypes} from './constants';

const typeMap = {
  String: 'string',
  Int: 'number',
  Float: 'number',
  Boolean: 'boolean',
  ID: 'string',
  DateTime: 'string',
  Date: 'string',
  Time: 'string',
};

const generatedTypes = ['key', 'pk', 'sk'];

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
          const originalType = loc.startToken.value;
          const type =
            typeMap[loc.startToken.value] || `I${loc.startToken.value}`;
          const required = loc.endToken.kind === '!';

          return {
            key,
            type,
            required,
            originalType,
            generated: !!(model._fields[key].astNode.directives || []).find(
              (directive) => directive.name.value === 'generated',
            ),
          } as FlattenedField;
        }),
    };
  }, {});
};
