import * as fs from 'fs';
import {generate} from './index';

const cli = async () => {
  const currentDirectory = process.cwd();

  console.log('Generating schema...');

  if (!fs.existsSync(`${currentDirectory}/gqldb.graphql`)) {
    throw new Error(`No gqldb.graphql found in ${currentDirectory}`);
  }

  const schema = fs.readFileSync(`${currentDirectory}/gqldb.graphql`, 'utf8');

  const defaultOptions = {
    generateApi: true,
  };

  const options =
    fs.existsSync(`${currentDirectory}/gqldb.json`) &&
    (await import(`${currentDirectory}/gqldb.json`));

  await generate(schema, options || defaultOptions);

  console.log('Done!');
};

cli();
