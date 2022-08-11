import {IModels, ISelectors} from '@graphqldb/types';

export const getSelectors = (models: IModels): ISelectors => {
  return Object.keys(models).reduce((prev, current) => {
    const model = models[current];

    return {
      ...prev,
      [current]: Object.keys(model._fields)
        .filter((key) => {
          const isPk = !!(model._fields[key].astNode.directives || []).find(
            (directive) => directive.name.value === 'pk',
          );
          const isSk = !!(model._fields[key].astNode.directives || []).find(
            (directive) => directive.name.value === 'sk',
          );
          const isKey = !!(model._fields[key].astNode.directives || []).find(
            (directive) => directive.name.value === 'key',
          );

          return isPk || isSk || isKey;
        })
        .reduce(
          (prev, key) => {
            const field = model._fields[key];
            const directive = field.astNode.directives.find(
              (directive) =>
                directive.name.value === 'pk' ||
                directive.name.value === 'sk' ||
                directive.name.value === 'key',
            );

            const keyArg = directive.arguments.find(
              (arg) => arg.name.value === 'key',
            );
            const keyValue = keyArg.value.value;
            const keyValues = keyValue
              .split('{{')
              .filter((key) => key.includes('}}'))
              .map((key) => key.split('}}')[0]);

            return {
              ...prev,
              keys: [
                ...prev.keys,
                {
                  type: directive.name.value,
                  key: field.name,
                  value: keyValue,
                },
              ],
              fields:
                directive.name.value === 'key'
                  ? prev.fields
                  : [...prev.fields, ...keyValues],
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
