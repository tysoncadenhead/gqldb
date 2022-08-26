import * as fs from 'fs';
import {IWriter} from 'graphqldb-types';

export const writeGeneratedScript = ({options, out}: IWriter) => {
  const outputPath = options?.outputPath || './.gqldb';
  fs.existsSync(outputPath) || fs.mkdirSync(outputPath);
  fs.writeFileSync(
    `${outputPath}/index.ts`,
    `${out.ts}`.replace(/'/g, '"').replace(/\n\n*/g, '\r\n'),
  );
};
