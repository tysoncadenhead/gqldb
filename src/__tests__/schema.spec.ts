import * as fs from 'fs';
import * as path from 'path';
import {setAdapter, gql} from '..';
import {memoryAdapter} from '../adapters/memoryAdapter';
import {setup, OUTPUT_PATH} from '../testUtils/setup';
import {ApolloServer} from 'apollo-server';

const CREATE_PERSON_QUERY = gql`
  mutation CreatePerson($input: CreatePersonInput!) {
    createPerson(input: $input) {
      id
      firstName
      lastName
    }
  }
`;

const QUERY_PERSON_QUERY = gql`
  query QueryPersonRecords($input: QueryPersonRecordsInput!) {
    queryPersonRecords(input: $input) {
      limit
      lastKey
      items {
        id
        firstName
        lastName
      }
    }
  }
`;

const GET_PERSON_QUERY = gql`
  query GetPerson($input: GetPersonInput!) {
    getPerson(input: $input) {
      id
      firstName
      lastName
    }
  }
`;

const UPDATE_PERSON_QUERY = gql`
  mutation UpdatePerson($input: UpdatePersonInput!) {
    updatePerson(input: $input) {
      id
      firstName
      lastName
    }
  }
`;

const DELETE_PERSON_QUERY = gql`
  mutation DeletePerson($input: DeletePersonInput!) {
    deletePerson(input: $input) {
      id
      firstName
      lastName
    }
  }
`;

const createTestServer = async () => {
  const {resolvers} = await import(OUTPUT_PATH);
  const typeDefs = fs.readFileSync(
    path.resolve(__dirname, `${OUTPUT_PATH}/schema.graphql`),
    'utf8',
  );
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};

const createPerson = async (testServer) => {
  return await testServer.executeOperation({
    query: CREATE_PERSON_QUERY,
    variables: {
      input: {
        firstName: 'John',
        lastName: 'Doe',
      },
    },
  });
};

describe('GraphQL Schema', () => {
  beforeAll(() => {
    setAdapter(memoryAdapter);
    setup();
  });

  afterAll(() => {
    setAdapter(memoryAdapter);
  });

  it('Should create a record', async () => {
    const testServer = await createTestServer();
    const res = await createPerson(testServer);

    expect(res.data?.createPerson.firstName).toBe('John');
    expect(res.data?.createPerson.lastName).toBe('Doe');
  });

  it('Should get a record', async () => {
    const testServer = await createTestServer();
    const res = await createPerson(testServer);

    const res2 = await testServer.executeOperation({
      query: GET_PERSON_QUERY,
      variables: {
        input: {
          id: res.data?.createPerson.id,
        },
      },
    });

    expect(res2.data?.getPerson.firstName).toBe('John');
    expect(res2.data?.getPerson.lastName).toBe('Doe');
  });

  it('Should update a record', async () => {
    const testServer = await createTestServer();
    const res = await createPerson(testServer);

    const res2 = await testServer.executeOperation({
      query: UPDATE_PERSON_QUERY,
      variables: {
        input: {
          id: res.data?.createPerson.id,
          firstName: 'Jane',
          lastName: 'Doe',
        },
      },
    });

    expect(res2.data?.updatePerson.firstName).toBe('Jane');
    expect(res2.data?.updatePerson.lastName).toBe('Doe');
  });

  it('Should delete a record', async () => {
    const testServer = await createTestServer();
    const res = await createPerson(testServer);

    const res2 = await testServer.executeOperation({
      query: DELETE_PERSON_QUERY,
      variables: {
        input: {
          id: res.data?.createPerson.id,
        },
      },
    });

    expect(res2.data?.deletePerson.firstName).toBe('John');
    expect(res2.data?.deletePerson.lastName).toBe('Doe');
  });

  it('Should query the records', async () => {
    const testServer = await createTestServer();
    await createPerson(testServer);

    const res2 = await testServer.executeOperation({
      query: QUERY_PERSON_QUERY,
      variables: {
        input: {
          limit: 1,
        },
      },
    });

    expect(res2.data?.queryPersonRecords.items.length).toBe(1);
  });
});
