import {IAdapterOptions} from '../../types';
import {v4 as uuid} from 'uuid';
import Mustache from 'mustache';

export const generateDynamicFields = <A>(
  options: IAdapterOptions,
  input: A,
) => {
  const record = {
    ...input,
    id: uuid(),
  };
  const recordWithKeys = {
    ...record,
    ...options.keys.reduce((prev, current) => {
      return {
        ...prev,
        [current.key]: Mustache.render(current.value, record),
      };
    }, {}),
  };
  return {record, recordWithKeys};
};
