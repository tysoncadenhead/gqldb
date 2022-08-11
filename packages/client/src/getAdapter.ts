import {AdapterInterface} from '@graphqldb/adapter';
import {memoryAdapter} from '@graphqldb/adapter-memory';

let adapter: AdapterInterface = memoryAdapter;

export const getAdapter = () => {
  return adapter;
};

export const setAdapter = (newAdapter) => {
  adapter = newAdapter;
};
