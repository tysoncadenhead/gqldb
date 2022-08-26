import {IOut} from 'graphqldb-types';
import {toCamelCase} from '../utils/toCamelCase';
import {IProcessor} from '../types';
import {getModels} from '../selectors/getModels';
import {removeEmptyLines} from '../utils/removeEmptyLines';

export const permissionsProcessor = ({prev, json}: IProcessor): IOut => {
  const models = getModels(json);
  return {
    ...prev,
    ts: removeEmptyLines(`${prev.ts || ''}
export enum Permissions {
${Object.keys(models)
  .map((key) => {
    const item = toCamelCase(key);
    return `    "${item}.create" = "${item}.create",
    "${item}.update" = "${item}.update",
    "${item}.delete" = "${item}.delete",
    "${item}.read" = "${item}.read",`;
  })
  .join('\n')}
}`),
  };
};
