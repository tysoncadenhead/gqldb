import {ISelectors} from '@graphqldb/types';
import {ISchemaJson, KeyType} from '../types';
import {getModels} from './getModels';

export const getSelectors = (json: ISchemaJson): ISelectors => {
  const models = getModels(json);
  return Object.keys(models).reduce((prev, current) => {
    const model = models[current];

    return {
      ...prev,
      [current]: Object.keys(model.fields)
        .filter((key) => {
          const keyDirective = model.fields[key].directives.key;
          return (
            keyDirective &&
            (keyDirective.type === KeyType.pk ||
              keyDirective.type === KeyType.sk)
          );
        })
        .reduce(
          (prev, key) => {
            const field = model.fields[key];
            const directive = field.directives.key;

            const keyValues = (directive.key || '')
              .split('{{')
              .filter((key) => key.includes('}}'))
              .map((key) => key.split('}}')[0]);

            return {
              ...prev,
              keys: [
                ...prev.keys,
                {
                  type: directive.type,
                  key,
                  value: directive.key,
                },
              ],
              fields: [...prev.fields, ...keyValues],
            };
          },
          {
            keys: [],
            fields: [],
          },
        ),
    };
  }, {});
};
