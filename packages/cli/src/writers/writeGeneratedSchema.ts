import * as fs from 'fs';
import {IWriter} from 'graphqldb-types';
import {buildSchema, printSchema} from 'graphql';

export const writeGeneratedSchema = ({options, out}: IWriter) => {
  console.log('Writing generated schema...');
  const outputPath = options?.outputPath || './.gqldb';
  fs.existsSync(outputPath) || fs.mkdirSync(outputPath);
  fs.writeFileSync(
    `${outputPath}/schema.graphql`,
    printSchema(buildSchema(out.schema)),
  );
};
