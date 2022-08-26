// THIS IS A GENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
import * as fs from 'fs';
import * as path from 'path';
import adapter from 'graphqldb-adapter-dynamodb';
import {
  setAdapter,
  getAdapter,
  validate,
  getArguments,
  getContext,
  checkPermissions,
  wrapResolver,
} from 'graphqldb-client';
setAdapter(adapter);
interface IEmail {
  domain?: string;
  address?: string;
}
interface IAddress {
  id: string;
  personId: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  person: () => Promise<IPerson>;
}
interface IUpdateAddress {
  id: string;
  personId: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}
interface IAddressSelectors {
  id: string;
  personId: string;
}
interface IAddressQuerySelectors {
  limit?: number;
  startKey?: string;
  id?: string;
  personId?: string;
}
interface IAddressByStateQuerySelectors {
  limit?: number;
  startKey?: string;
  id?: string;
  city?: string;
  state?: string;
}
interface IPaginatedAddress {
  items: IAddress[];
  lastKey: string | null;
  limit: number;
}
interface ICreateAddress {
  personId: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}
interface IPerson {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  emails?: IEmail[];
  addresses: () => Promise<IAddress[]>;
}
interface IUpdatePerson {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  emails?: IEmail[];
}
interface IPersonSelectors {
  id: string;
}
interface IPersonQuerySelectors {
  limit?: number;
  startKey?: string;
  id?: string;
}
interface IPaginatedPerson {
  items: IPerson[];
  lastKey: string | null;
  limit: number;
}
interface ICreatePerson {
  firstName: string;
  lastName: string;
  age?: number;
  emails?: IEmail[];
}
interface IValidation {
  id: string;
  minLength: string;
  maxLength: string;
  min: number;
  max: number;
  pattern: string;
  startsWith: string;
  endsWith: string;
  contains: string;
  notContains: string;
}
interface IUpdateValidation {
  id: string;
  minLength: string;
  maxLength: string;
  min: number;
  max: number;
  pattern: string;
  startsWith: string;
  endsWith: string;
  contains: string;
  notContains: string;
}
interface IValidationSelectors {
  id: string;
}
interface IValidationQuerySelectors {
  limit?: number;
  startKey?: string;
  id?: string;
}
interface IPaginatedValidation {
  items: IValidation[];
  lastKey: string | null;
  limit: number;
}
interface ICreateValidation {
  minLength: string;
  maxLength: string;
  min: number;
  max: number;
  pattern: string;
  startsWith: string;
  endsWith: string;
  contains: string;
  notContains: string;
}
const validations = {
  Address: {
    pk: {},
    sk: {},
    gsi1: {},
    id: {},
    personId: {},
    street: {},
    city: {},
    state: {},
    zip: {},
    person: {},
  },
  Email: {domain: {}, address: {}},
  Person: {
    pk: {},
    sk: {},
    id: {},
    firstName: {},
    lastName: {},
    age: {},
    addresses: {},
    emails: {},
  },
  Validation: {
    pk: {},
    sk: {},
    id: {},
    minLength: {minLength: '3'},
    maxLength: {maxLength: '3'},
    min: {min: '3'},
    max: {max: '3'},
    pattern: {pattern: '[a-z]*'},
    startsWith: {startsWith: 'a'},
    endsWith: {endsWith: 'a'},
    contains: {contains: 'a'},
    notContains: {notContains: 'a'},
  },
};
export enum Permissions {
  'address.create' = 'address.create',
  'address.update' = 'address.update',
  'address.delete' = 'address.delete',
  'address.read' = 'address.read',
  'person.create' = 'person.create',
  'person.update' = 'person.update',
  'person.delete' = 'person.delete',
  'person.read' = 'person.read',
  'validation.create' = 'validation.create',
  'validation.update' = 'validation.update',
  'validation.delete' = 'validation.delete',
  'validation.read' = 'validation.read',
}
const optionsForAddress = {
  model: 'Address',
  tableName: 'mindful-ex-tyson',
  indexes: [
    {
      name: 'ByState',
      index: 'gsi1index',
      pk: 'pk',
      sk: 'gsi1',
    },
  ],
  keys: [
    {key: 'pk', type: 'pk', value: 'Address', fields: []},
    {
      key: 'sk',
      type: 'sk',
      value: 'personId:{{personId}}|id:{{id}}',
      fields: ['personId', 'id'],
    },
    {
      key: 'gsi1',
      type: 'default',
      value: 'state:{{state}}|city:{{city}}|id:{{id}}',
      fields: ['state', 'city', 'id'],
    },
  ],
};
const optionsForPerson = {
  model: 'Person',
  tableName: 'mindful-ex-tyson',
  indexes: [],
  keys: [
    {key: 'pk', type: 'pk', value: 'Person', fields: []},
    {key: 'sk', type: 'sk', value: 'id:{{id}}', fields: ['id']},
  ],
};
const optionsForValidation = {
  model: 'Validation',
  tableName: 'mindful-ex-tyson',
  indexes: [],
  keys: [
    {key: 'pk', type: 'pk', value: 'Validation', fields: []},
    {key: 'sk', type: 'sk', value: 'id:{{id}}', fields: ['id']},
  ],
};
const relationshipsForAddress = (data: IAddress) => ({
  ...data,
  person: async () => {
    return await Person.find({id: data.personId});
  },
});
const relationshipsForPerson = (data: IPerson) => ({
  ...data,
  addresses: async () => {
    const result = await Address.query({personId: data.id});
    return result.items;
  },
});
const relationshipsForValidation = (data: IValidation) => ({
  ...data,
});
export const Address = {
  create: async (data: ICreateAddress): Promise<IAddress> => {
    validate(validations.Address, data);
    return relationshipsForAddress(
      await getAdapter().create<ICreateAddress, IAddress>(
        optionsForAddress,
        data,
      ),
    );
  },
  update: async (data: IUpdateAddress): Promise<IAddress> => {
    validate(validations.Address, data);
    return relationshipsForAddress(
      await getAdapter().update<IUpdateAddress, IAddress>(
        optionsForAddress,
        data,
      ),
    );
  },
  delete: async (data: IAddressSelectors): Promise<IAddress> => {
    return relationshipsForAddress(
      await getAdapter().delete<IAddressSelectors, IAddress>(
        optionsForAddress,
        data,
      ),
    );
  },
  find: async (data: IAddressSelectors): Promise<IAddress> => {
    return relationshipsForAddress(
      await getAdapter().find<IAddressSelectors, IAddress>(
        optionsForAddress,
        data,
      ),
    );
  },
  query: async (data: IAddressQuerySelectors): Promise<IPaginatedAddress> => {
    const result = await getAdapter().query<
      IAddressQuerySelectors,
      IPaginatedAddress
    >(optionsForAddress, data);
    return {
      ...result,
      items: result.items.map(relationshipsForAddress),
    };
  },
  queryByState: async (
    data: IAddressByStateQuerySelectors,
  ): Promise<IPaginatedAddress> => {
    const result = await getAdapter().queryByIndex<
      IAddressByStateQuerySelectors,
      IPaginatedAddress
    >(optionsForAddress, 'ByState', data);
    return {
      ...result,
      items: result.items.map(relationshipsForAddress),
    };
  },
};
export const Person = {
  create: async (data: ICreatePerson): Promise<IPerson> => {
    validate(validations.Person, data);
    return relationshipsForPerson(
      await getAdapter().create<ICreatePerson, IPerson>(optionsForPerson, data),
    );
  },
  update: async (data: IUpdatePerson): Promise<IPerson> => {
    validate(validations.Person, data);
    return relationshipsForPerson(
      await getAdapter().update<IUpdatePerson, IPerson>(optionsForPerson, data),
    );
  },
  delete: async (data: IPersonSelectors): Promise<IPerson> => {
    return relationshipsForPerson(
      await getAdapter().delete<IPersonSelectors, IPerson>(
        optionsForPerson,
        data,
      ),
    );
  },
  find: async (data: IPersonSelectors): Promise<IPerson> => {
    return relationshipsForPerson(
      await getAdapter().find<IPersonSelectors, IPerson>(
        optionsForPerson,
        data,
      ),
    );
  },
  query: async (data: IPersonQuerySelectors): Promise<IPaginatedPerson> => {
    const result = await getAdapter().query<
      IPersonQuerySelectors,
      IPaginatedPerson
    >(optionsForPerson, data);
    return {
      ...result,
      items: result.items.map(relationshipsForPerson),
    };
  },
};
export const Validation = {
  create: async (data: ICreateValidation): Promise<IValidation> => {
    validate(validations.Validation, data);
    return relationshipsForValidation(
      await getAdapter().create<ICreateValidation, IValidation>(
        optionsForValidation,
        data,
      ),
    );
  },
  update: async (data: IUpdateValidation): Promise<IValidation> => {
    validate(validations.Validation, data);
    return relationshipsForValidation(
      await getAdapter().update<IUpdateValidation, IValidation>(
        optionsForValidation,
        data,
      ),
    );
  },
  delete: async (data: IValidationSelectors): Promise<IValidation> => {
    return relationshipsForValidation(
      await getAdapter().delete<IValidationSelectors, IValidation>(
        optionsForValidation,
        data,
      ),
    );
  },
  find: async (data: IValidationSelectors): Promise<IValidation> => {
    return relationshipsForValidation(
      await getAdapter().find<IValidationSelectors, IValidation>(
        optionsForValidation,
        data,
      ),
    );
  },
  query: async (
    data: IValidationQuerySelectors,
  ): Promise<IPaginatedValidation> => {
    const result = await getAdapter().query<
      IValidationQuerySelectors,
      IPaginatedValidation
    >(optionsForValidation, data);
    return {
      ...result,
      items: result.items.map(relationshipsForValidation),
    };
  },
};
interface IGetResolvers {
  checkPermissions?: (permissions: Permissions[], ctx: any) => boolean;
  hooks?: {
    before?: (name: string, input: any) => any;
    after?: (name: string, input: any) => any;
  };
}
export const getResolvers = (resolverOptions?: IGetResolvers) => {
  const wrap = wrapResolver(resolverOptions);
  return {
    Address: {
      person: wrap(
        'Address.person',
        [Permissions['person.read']],
        async ({ctx}) => {
          return await Person.find({id: ctx.personId});
        },
      ),
    },
    Person: {
      addresses: wrap(
        'Person.addresses',
        [Permissions['address.read']],
        async ({ctx}) => {
          const result = await Address.query({id: ctx.personId});
          return result.items;
        },
      ),
    },
    Validation: {},
    Query: {
      getAddress: wrap(
        'Query.getAddress',
        [Permissions['address.read']],
        async ({args}) => await Address.find(args),
      ),
      queryAddressRecords: wrap(
        'Query.queryAddressRecords',
        [Permissions['address.read']],
        async ({args}) => await Address.query(args),
      ),
      queryAddressRecordsByState: wrap(
        'Query.queryAddressRecordsByState',
        [Permissions['address.read']],
        async ({args}) => await Address.queryByState(args),
      ),
      getPerson: wrap(
        'Query.getPerson',
        [Permissions['person.read']],
        async ({args}) => await Person.find(args),
      ),
      queryPersonRecords: wrap(
        'Query.queryPersonRecords',
        [Permissions['person.read']],
        async ({args}) => await Person.query(args),
      ),
      getValidation: wrap(
        'Query.getValidation',
        [Permissions['validation.read']],
        async ({args}) => await Validation.find(args),
      ),
      queryValidationRecords: wrap(
        'Query.queryValidationRecords',
        [Permissions['validation.read']],
        async ({args}) => await Validation.query(args),
      ),
    },
    Mutation: {
      createAddress: wrap(
        'Mutation.createAddress',
        [Permissions['address.create']],
        async ({args}) => await Address.create(args),
      ),
      updateAddress: wrap(
        'Mutation.updateAddress',
        [Permissions['address.update']],
        async ({args}) => await Address.update(args),
      ),
      deleteAddress: wrap(
        'Mutation.deleteAddress',
        [Permissions['address.delete']],
        async ({args}) => await Address.delete(args),
      ),
      createPerson: wrap(
        'Mutation.createPerson',
        [Permissions['person.create']],
        async ({args}) => await Person.create(args),
      ),
      updatePerson: wrap(
        'Mutation.updatePerson',
        [Permissions['person.update']],
        async ({args}) => await Person.update(args),
      ),
      deletePerson: wrap(
        'Mutation.deletePerson',
        [Permissions['person.delete']],
        async ({args}) => await Person.delete(args),
      ),
      createValidation: wrap(
        'Mutation.createValidation',
        [Permissions['validation.create']],
        async ({args}) => await Validation.create(args),
      ),
      updateValidation: wrap(
        'Mutation.updateValidation',
        [Permissions['validation.update']],
        async ({args}) => await Validation.update(args),
      ),
      deleteValidation: wrap(
        'Mutation.deleteValidation',
        [Permissions['validation.delete']],
        async ({args}) => await Validation.delete(args),
      ),
    },
  };
};
export const getTypeDefs = () =>
  fs.readFileSync(path.resolve(__dirname, './schema.graphql'), 'utf8');
