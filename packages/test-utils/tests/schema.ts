import {gql} from './gql';
import {AdapterInterface} from '@graphqldb/adapter';
import {setAdapter} from '@graphqldb/client';
import {ApolloServer} from 'apollo-server';
import {getResolvers, getTypeDefs, Permissions} from '../.gqldb';
import {cleanup} from './cleanup';

const CREATE_PERSON_QUERY = gql`
  mutation CreatePerson($input: CreatePersonInput!) {
    createPerson(input: $input) {
      id
      firstName
      lastName
    }
  }
`;

const CREATE_ADDRESS_QUERY = gql`
  mutation CreateAddress($input: CreateAddressInput!) {
    createAddress(input: $input) {
      id
    }
  }
`;

const GET_PERSON_WITH_ADDRESSES_QUERY = gql`
  query GetPerson($input: GetPersonInput!) {
    getPerson(input: $input) {
      id
      addresses {
        id
        city
        state
      }
    }
  }
`;

const GET_ADDRESS_WITH_PERSON_QUERY = gql`
  query GetAddress($input: GetAddressInput!) {
    getAddress(input: $input) {
      id
      person {
        id
        firstName
        lastName
      }
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
  const resolvers = getResolvers();
  const typeDefs = getTypeDefs();
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};

const createTestServerWithAuth = async () => {
  const allowedPermissions = [
    Permissions['person.create'],
    Permissions['person.delete'],
  ];
  const resolvers = getResolvers({
    checkPermissions: (permissions, _ctx) => {
      return permissions.every((permission) =>
        allowedPermissions.includes(permission),
      );
    },
  });
  const typeDefs = getTypeDefs();
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

export const schema = (adapterName: string, adapterType: AdapterInterface) =>
  describe(`${adapterName} GraphQL Schema`, () => {
    beforeAll(async () => {
      setAdapter(adapterType);
    });

    afterAll(cleanup);

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

    it('Should query with relationships', async () => {
      const testServer = await createTestServer();
      const res = await createPerson(testServer);

      const res2 = await testServer.executeOperation({
        query: CREATE_ADDRESS_QUERY,
        variables: {
          input: {
            personId: res.data?.createPerson.id,
            street: '222 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '12345',
          },
        },
      });

      const res3 = await testServer.executeOperation({
        query: GET_PERSON_WITH_ADDRESSES_QUERY,
        variables: {
          input: {
            id: res.data?.createPerson.id,
          },
        },
      });

      expect(res3.data?.getPerson.addresses[0].state).toBe('CA');

      const res4 = await testServer.executeOperation({
        query: GET_ADDRESS_WITH_PERSON_QUERY,
        variables: {
          input: {
            id: res2.data?.createAddress.id,
            personId: res.data?.createPerson.id,
          },
        },
      });

      expect(res4.data?.getAddress.person.firstName).toBe('John');
    });

    it('Should not allow a user to be fetched if the auth check returns false', async () => {
      const testServer = await createTestServerWithAuth();
      const res = await createPerson(testServer);

      const res2 = await testServer.executeOperation({
        query: GET_PERSON_QUERY,
        variables: {
          input: {
            id: res.data?.createPerson.id,
          },
        },
      });

      expect(res2.errors[0].message).toBe('Unauthorized');
    });
  });
