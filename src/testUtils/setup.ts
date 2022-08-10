import {getDb, gql} from '..';

const schema = gql`
  type Address @model(table: "mindful-ex-tyson") {
    pk: String! @pk(key: "Address")
    sk: String! @sk(key: "personId:{{personId}}|id:{{id}}")
    id: ID! @generated
    personId: ID!
    street: String!
    city: String!
    state: String!
    zip: String!
    person: Person! @belongsTo(pk: "Person", sk: "id:{{personId}}")
  }

  type Person @model(table: "mindful-ex-tyson") {
    pk: String! @pk(key: "Person")
    sk: String! @sk(key: "id:{{id}}")
    id: ID! @generated
    firstName: String!
    lastName: String!
    age: Int
    addresses: [Address!]! @hasMany(pk: "Address", sk: "personId:{{id}}")
  }
`;

export const setup = () => {
  getDb(schema, {
    generateApi: true,
    outputScriptPath: './src/.gqldb/index.ts',
    outputSchemaPath: './src/.gqldb/schema.graphql',
  });
};

export const OUTPUT_PATH = '../.gqldb';
