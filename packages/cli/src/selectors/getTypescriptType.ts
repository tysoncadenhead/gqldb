import {typeMap} from '../constants';

export const getTypescriptType = (type: string) => {
  return typeMap[type] || `I${type}`;
};
