import Mustache from 'mustache';
import {IKey} from 'graphqldb-types';

export const buildPartialKey = <T>(key: IKey, input: T) =>
  Mustache.render(key.value, {
    ...Object.keys(key.fields).reduce((prev, current) => {
      return {
        ...prev,
        [key.fields[current]]: '__NULL__',
      };
    }, {}),
    ...input,
  }).split('__NULL__')[0];
