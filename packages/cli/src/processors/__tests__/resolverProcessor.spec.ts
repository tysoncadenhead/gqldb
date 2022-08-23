import {ISchemaJson, KeyType} from '../../types';
import {resolverProcessor} from '../resolverProcessor';

describe('resolverProcessor', () => {
  it('should return the resolvers', () => {
    const expected = `interface IGetResolvers {
  checkPermissions?: (permissions: Permissions[], ctx: any) => boolean;
}
export const getResolvers = (resolverOptions?: IGetResolvers) => ({
  Person: {
  },
  Query: {
    getPerson: async (a, b) => {
      const args = getArguments<IPersonSelectors>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions[\"person.read\"]], ctx, resolverOptions?.checkPermissions);
      return await Person.find(args);
    },
    queryPersonRecords: async (a, b) => {
      const args = getArguments<IPersonQuerySelectors>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions[\"person.read\"]], ctx, resolverOptions?.checkPermissions);
      return await Person.query(args);
    },
  },
  Mutation: {
    createPerson: async (a, b) => {
      const args = getArguments<ICreatePerson>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions[\"person.create\"]], ctx, resolverOptions?.checkPermissions);
      return await Person.create(args);
    },
    updatePerson: async (a, b) => {
      const args = getArguments<IUpdatePerson>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions[\"person.update\"]], ctx, resolverOptions?.checkPermissions);
      return await Person.update(args);
    },
    deletePerson: async (a, b) => {
      const args = getArguments<IPersonSelectors>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions[\"person.delete\"]], ctx, resolverOptions?.checkPermissions);
      return await Person.delete(args);
    },
  },
});
export const getTypeDefs = () => fs.readFileSync(path.resolve(__dirname, './schema.graphql'), 'utf8');`;

    const json: ISchemaJson = {
      Person: {
        directives: {
          model: {},
        },
        fields: {
          pk: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {
              key: {
                key: 'Address',
                type: KeyType.pk,
              },
            },
          },
          sk: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {
              key: {
                key: 'personId:{{personId}}|id:{{id}}',
                type: KeyType.sk,
              },
            },
          },
          id: {
            type: 'ID',
            required: true,
            isArray: false,
            directives: {
              uuid: {},
            },
          },
          firstName: {
            type: 'String',
            required: true,
            directives: {},
            isArray: false,
          },
          lastName: {
            type: 'String',
            required: true,
            directives: {},
            isArray: false,
          },
        },
      },
    };
    const result = resolverProcessor({
      json,
      prev: {},
      options: {generateApi: true},
    });
    expect(result).toEqual({
      ts: expected,
    });
  });

  it('Should convert the full db schema', () => {
    const expected = `interface IGetResolvers {
  checkPermissions?: (permissions: Permissions[], ctx: any) => boolean;
}
export const getResolvers = (resolverOptions?: IGetResolvers) => ({
  Address: {
    person: async (ctx) => {
      checkPermissions([Permissions[\"person.read\"]], ctx, resolverOptions?.checkPermissions);
      return await Person.find({ id: ctx.personId,})
    },
  },
  Person: {
    addresses: async (ctx) => {
      checkPermissions([Permissions[\"address.read\"]], ctx, resolverOptions?.checkPermissions);
      const result = await Address.query({ id: ctx.personId,});
      return result.items;
    },
  },
  Query: {
    getAddress: async (a, b) => {
      const args = getArguments<IAddressSelectors>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions[\"address.read\"]], ctx, resolverOptions?.checkPermissions);
      return await Address.find(args);
    },
    queryAddressRecords: async (a, b) => {
      const args = getArguments<IAddressQuerySelectors>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions[\"address.read\"]], ctx, resolverOptions?.checkPermissions);
      return await Address.query(args);
    },
    queryAddressRecordsByState: async (a, b) => {
      const args = getArguments<IAddressByStateQuerySelectors>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions[\"address.read\"]], ctx, resolverOptions?.checkPermissions);
      return await Address.queryByState(args);
    },
    getPerson: async (a, b) => {
      const args = getArguments<IPersonSelectors>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions[\"person.read\"]], ctx, resolverOptions?.checkPermissions);
      return await Person.find(args);
    },
    queryPersonRecords: async (a, b) => {
      const args = getArguments<IPersonQuerySelectors>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions[\"person.read\"]], ctx, resolverOptions?.checkPermissions);
      return await Person.query(args);
    },
  },
  Mutation: {
    createAddress: async (a, b) => {
      const args = getArguments<ICreateAddress>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions[\"address.create\"]], ctx, resolverOptions?.checkPermissions);
      return await Address.create(args);
    },
    updateAddress: async (a, b) => {
      const args = getArguments<IUpdateAddress>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions[\"address.update\"]], ctx, resolverOptions?.checkPermissions);
      return await Address.update(args);
    },
    deleteAddress: async (a, b) => {
      const args = getArguments<IAddressSelectors>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions[\"address.delete\"]], ctx, resolverOptions?.checkPermissions);
      return await Address.delete(args);
    },
    createPerson: async (a, b) => {
      const args = getArguments<ICreatePerson>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions[\"person.create\"]], ctx, resolverOptions?.checkPermissions);
      return await Person.create(args);
    },
    updatePerson: async (a, b) => {
      const args = getArguments<IUpdatePerson>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions[\"person.update\"]], ctx, resolverOptions?.checkPermissions);
      return await Person.update(args);
    },
    deletePerson: async (a, b) => {
      const args = getArguments<IPersonSelectors>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions[\"person.delete\"]], ctx, resolverOptions?.checkPermissions);
      return await Person.delete(args);
    },
  },
});
export const getTypeDefs = () => fs.readFileSync(path.resolve(__dirname, './schema.graphql'), 'utf8');`;
    const json = {
      Address: {
        directives: {
          model: {
            table: 'addresses',
            indexes: [
              {
                name: 'ByState',
                index: 'gsi1index',
                pk: 'pk',
                sk: 'gsi1',
              },
            ],
          },
        },
        fields: {
          pk: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {
              key: {
                key: 'Address',
                type: KeyType.pk,
              },
            },
          },
          sk: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {
              key: {
                key: 'personId:{{personId}}|id:{{id}}',
                type: KeyType.sk,
              },
            },
          },
          gsi1: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {
              key: {
                key: 'state:{{state}}|city:{{city}}|id:{{id}}',
              },
            },
          },
          id: {
            type: 'ID',
            required: true,
            isArray: false,
            directives: {
              uuid: {},
            },
          },
          personId: {
            type: 'ID',
            required: true,
            isArray: false,
            directives: {},
          },
          street: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {},
          },
          city: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {},
          },
          state: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {},
          },
          zip: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {},
          },
          person: {
            type: 'Person',
            required: true,
            isArray: false,
            directives: {
              belongsTo: {
                pk: 'Person',
                sk: 'id:{{personId}}',
              },
            },
          },
        },
      },
      Email: {
        directives: {},
        fields: {
          domain: {
            type: 'String',
            required: false,
            isArray: false,
            directives: {},
          },
          address: {
            type: 'String',
            required: false,
            isArray: false,
            directives: {},
          },
        },
      },
      Person: {
        directives: {
          model: {},
        },
        fields: {
          pk: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {
              key: {
                key: 'Person',
                type: KeyType.pk,
              },
            },
          },
          sk: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {
              key: {
                key: 'id:{{id}}',
                type: KeyType.sk,
              },
            },
          },
          id: {
            type: 'ID',
            required: true,
            isArray: false,
            directives: {
              uuid: {},
            },
          },
          firstName: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {},
          },
          lastName: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {},
          },
          age: {
            type: 'Int',
            required: false,
            isArray: false,
            directives: {},
          },
          emails: {
            type: 'Email',
            required: false,
            directives: {},
            isArray: true,
          },
          addresses: {
            type: 'Address',
            required: true,
            directives: {
              hasMany: {
                pk: 'Address',
                sk: 'personId:{{id}}',
              },
            },
            isArray: true,
          },
        },
      },
    };
    const result = resolverProcessor({
      json,
      prev: {},
      options: {generateApi: true},
    });
    expect(result).toEqual({
      ts: expected,
    });
  });
});
