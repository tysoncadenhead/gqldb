import processors from './processors';
import writers from './writers';
import {IOptions, IOut} from '@graphqldb/types';
import {schemaToJson} from './transformers/schemaToJson';

export const generate = async (schemaString: string, options?: IOptions) => {
  const json = schemaToJson(schemaString);
  const out = processors.reduce((prev, processor) => {
    return processor({json, prev, options});
  }, {} as IOut);
  writers.forEach((writer) => writer({options, out}));
};
