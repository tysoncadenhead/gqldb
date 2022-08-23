import * as fs from 'fs';
import {generate} from './index';

const cli = async () => {
  const currentDirectory = process.cwd();

  console.log('Generating schema...');

  if (!fs.existsSync(`${currentDirectory}/gqldb.graphql`)) {
    fs.writeFileSync(
      `${currentDirectory}/gqldb.graphql`,
      `pk: String! @key(key: "Person", type: "pk")
sk: String! @key(key: "id:{{id}}", type: "sk")
type Person @model {
  id: ID! @uuid
  firstName: String!
  lastName: String!
}`,
      'utf8',
    );
  }

  if (!fs.existsSync(`${currentDirectory}/gqldb.json`)) {
    fs.writeFileSync(
      `${currentDirectory}/gqldb.json`,
      JSON.stringify({
        generateApi: true,
        tableName: 'my-gqldb-table',
        adapter: '@graphqldb/adapter-memory',
      }),
      'utf8',
    );
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
