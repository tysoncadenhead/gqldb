import {IModels, IRelationships} from '../types';
import {relationshipTypes} from './constants';

const getKeyValue = (keyName: string, directive: any) => {
  const keyArg = directive.arguments.find((arg) => arg.name.value === keyName);
  return keyArg.value.value;
};

const getKeyArgs = (keyName: string, directive: any) => {
  const keyValue = getKeyValue(keyName, directive);
  const keyValues = keyValue
    .split('{{')
    .filter((key) => key.includes('}}'))
    .map((key) => key.split('}}')[0]);
  return keyValues;
};

export const getRelationships = (models: IModels): IRelationships => {
  return Object.keys(models).reduce((prev, current) => {
    const model = models[current];

    return {
      ...prev,
      [current]: Object.keys(model._fields)
        .filter((key) => {
          return !!(model._fields[key].astNode.directives || []).find(
            (directive) => relationshipTypes.includes(directive.name.value),
          );
        })
        .reduce((prev, key) => {
          const field = model._fields[key];
          const directive = field.astNode.directives.find((directive) =>
            relationshipTypes.includes(directive.name.value),
          );
          const pk = getKeyValue('pk', directive);
          const sk = getKeyValue('sk', directive);
          const pkKeys = getKeyArgs('pk', directive);
          const skKeys = getKeyArgs('sk', directive);
          const keys = [...new Set([...pkKeys, ...skKeys])];
          const loc = field.astNode.type.loc;
          const objectType =
            loc.startToken.kind === '['
              ? loc.startToken.next.value
              : loc.startToken.value;
          const tsType = `I${objectType}`;

          return {
            ...prev,
            [field.name]: {
              type: directive.name.value,
              tsType,
              key: field.name,
              pk,
              sk,
              keys,
              objectType,
            },
          };
        }, {}),
    };
  }, {} as IRelationships);
};
