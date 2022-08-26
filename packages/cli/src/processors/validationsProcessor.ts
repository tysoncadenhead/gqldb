import {IOut} from 'graphqldb-types';
import {getValidations} from '../selectors/getValidations';
import {IProcessor} from '../types';

export const validationsProcessor = ({json, prev}: IProcessor): IOut => {
  const validations = getValidations(json);
  return {
    ...prev,
    ts: `${prev.ts || ''}
const validations = ${JSON.stringify(validations)};`,
  };
};
