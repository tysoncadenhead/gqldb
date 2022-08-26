import {IIndex} from 'graphqldb-types';
import {ISchemaJsonModel} from '../types';
import {parseKeyArgs} from './getKeyArgs';

export const getIndexArgs = (model: ISchemaJsonModel, index: IIndex) => {
  const pkIndex = Object.keys(model.fields).find((key) => key === index.pk);
  const skIndex = Object.keys(model.fields).find((key) => key === index.sk);
  const pkArgs = parseKeyArgs(model.fields[pkIndex].directives?.key?.key);
  const skArgs = parseKeyArgs(model.fields[skIndex].directives?.key?.key);
  const args = [...pkArgs, ...skArgs];

  return args;
};
