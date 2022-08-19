import {getKeyValue} from './getKeyValue';

export const parseKeyArgs = (keyValue: string = '') => {
  return keyValue
    .split('{{')
    .filter((key) => key.includes('}}'))
    .map((key) => key.split('}}')[0]);
};

export const getKeyArgs = (keyName: string, directive: any) => {
  const keyValue = getKeyValue(keyName, directive);
  return parseKeyArgs(keyValue);
};
