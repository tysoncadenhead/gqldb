import {AdapterInterface} from 'graphqldb-adapter';
import {crud} from './crud';
import {relationships} from './relationships';
import {schema} from './schema';

export const tests = (adapterName: string, adapterType: AdapterInterface) => {
  crud(adapterName, adapterType);
  relationships(adapterName, adapterType);
  schema(adapterName, adapterType);
};
