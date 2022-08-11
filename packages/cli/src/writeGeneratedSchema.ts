import * as fs from 'fs';

import {IOptions} from '@graphqldb/types';

export const writeGeneratedSchema = (schema: string, options: IOptions) => {
  if (!options.outputSchemaPath) {
    fs.existsSync('./.gqldb') || fs.mkdirSync('./.gqldb');
  }
  fs.writeFileSync(
    options.outputSchemaPath || './.gqldb/schema.graphql',
    schema,
  );
};
