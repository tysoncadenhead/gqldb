import {AdapterInterface} from './adapters/adapterInterface';
import {memoryAdapter} from './adapters/memoryAdapter';

let adapter: AdapterInterface = memoryAdapter;

export const getAdapter = () => {
  return adapter;
};

export const setAdapter = (newAdapter) => {
  adapter = newAdapter;
};
