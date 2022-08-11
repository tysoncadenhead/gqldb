import * as fs from 'fs';
import {IOptions} from '@graphqldb/types';

export const writeGeneratedScript = (ts: string, options: IOptions) => {
  if (!options.outputScriptPath) {
    fs.existsSync('./.gqldb') || fs.mkdirSync('./.gqldb');
  }
  fs.writeFileSync(options.outputScriptPath || './.gqldb/index.ts', ts);
};
