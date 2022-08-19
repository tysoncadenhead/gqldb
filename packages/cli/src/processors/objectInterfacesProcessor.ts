import {IOut} from '@graphqldb/types';
import {getObjectTypes} from '../selectors/getObjectTypes';
import {getTypescriptType} from '../selectors/getTypescriptType';
import {IProcessor} from '../types';
import {removeEmptyLines} from '../utils/removeEmptyLines';

export const objectInterfacesProcessor = ({json, prev}: IProcessor): IOut => {
  const objectTypes = getObjectTypes(json);

  return {
    ...prev,
    ts: removeEmptyLines(`${prev.ts || ''}
${Object.keys(objectTypes)
  .map((current) => {
    const model = objectTypes[current];
    return `interface I${current} {
${Object.keys(model.fields)
  .map((item) => {
    const field = model.fields[item];
    const type = getTypescriptType(field.type);

    return `  ${item}${field.required ? '' : '?'}: ${type}${
      field.isArray ? '[]' : ''
    };`;
  })
  .join('\n')}
}`;
  })
  .join('\n')}`),
  };
};
