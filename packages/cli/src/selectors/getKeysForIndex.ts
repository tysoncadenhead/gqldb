import {ISchemaJsonModel, ISchemaJsonIndex} from '../types';
import {parseKeyArgs} from '../utils/getKeyArgs';

export const getKeysForIndex = (
  index: ISchemaJsonIndex,
  model: ISchemaJsonModel,
) => {
  const pkKey = model.fields[index.pk]?.directives?.key.key;
  const skKey = model.fields[index.sk]?.directives?.key.key;
  const pkArgs = parseKeyArgs(pkKey);
  const skArgs = parseKeyArgs(skKey);
  const fields = [...new Set([...pkArgs, ...skArgs])];

  return {
    fields,
    pk: {
      field: index.pk,
      key: pkKey,
      fields: pkArgs,
    },
    sk: {
      field: index.sk,
      key: skKey,
      fields: skArgs,
    },
  };
};
