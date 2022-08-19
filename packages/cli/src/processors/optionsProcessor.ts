import {IOut} from '@graphqldb/types';
import {IProcessor} from '../types';
import {getModels} from '../selectors/getModels';
import {getKeys} from '../selectors/getKeys';
import {removeEmptyLines} from '../utils/removeEmptyLines';
import {parseKeyArgs} from '../utils/getKeyArgs';

export const optionsProcessor = ({json, prev, options}: IProcessor): IOut => {
  const models = getModels(json);
  const keys = getKeys(json);

  return {
    ...prev,
    ts: removeEmptyLines(
      Object.keys(models).reduce((prev, current) => {
        const model = models[current];

        const keysArray = Object.keys(model.fields)
          .filter((key) => {
            return !!model.fields[key].directives?.key;
          })
          .map((key) => {
            const keyObj = model.fields[key];
            return {
              key,
              type: keyObj.directives?.key?.type || 'default',
              value: keyObj.directives?.key?.key,
              fields: parseKeyArgs(keyObj.directives?.key?.key),
            };
          });
        return `${prev}
const optionsFor${current} = {
    model: '${current}',
    tableName: '${model.directives?.model?.table || options.tableName}',
    indexes: ${JSON.stringify(model.directives?.model?.indexes || [], null, 2)},
    keys: ${JSON.stringify(keysArray || [])},
};`;
      }, prev.ts || ''),
    ),
  };
};
