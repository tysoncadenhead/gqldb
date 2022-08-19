import {schemaToJson} from '../schemaToJson';
import {gql} from '../../utils/gql';
import {KeyType} from '../../types';

const schema = gql`
  type Address
    @model(
      table: "addresses"
      indexes: [{name: "ByState", index: "gsi1index", pk: "pk", sk: "gsi1"}]
    ) {
    pk: String! @key(key: "Address", type: "pk")
    sk: String! @key(key: "personId:{{personId}}|id:{{id}}", type: "sk")
    gsi1: String! @key(key: "state:{{state}}|city:{{city}}|id:{{id}}")
    id: ID! @uuid
    personId: ID!
    street: String!
    city: String!
    state: String!
    zip: String!
    person: Person! @belongsTo(pk: "Person", sk: "id:{{personId}}")
  }

  type Email {
    domain: String
    address: String
  }

  type Person @model {
    pk: String! @key(key: "Person", type: "pk")
    sk: String! @key(key: "id:{{id}}", type: "sk")
    id: ID! @uuid
    firstName: String!
    lastName: String!
    age: Int
    addresses: [Address!]! @hasMany(pk: "Address", sk: "personId:{{id}}")
    emails: [Email]
  }
`;

const parsed = {
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

describe('Schema to JSON', () => {
  it('Should flatten the types', () => {
    const result = schemaToJson(schema);

    expect(result.Address).toBeTruthy();
    expect(result.Person).toBeTruthy();
    expect(result.Email).toBeTruthy();
  });

  it('Should parse the type-level directives', () => {
    const result = schemaToJson(schema);

    expect(result.Email.directives).toEqual({});
    expect(result.Person.directives.model).toEqual({});
    expect(result.Address.directives.model.table).toEqual('addresses');
    expect(result.Address.directives.model.indexes[0]).toEqual({
      name: 'ByState',
      index: 'gsi1index',
      pk: 'pk',
      sk: 'gsi1',
    });
  });

  it('Should parse the fields', () => {
    const result = schemaToJson(schema);

    expect(result.Email.fields.domain).toBeTruthy();
    expect(result.Email.fields.address).toBeTruthy();
    expect(result.Email.fields.notAField).toBeFalsy();

    expect(result.Email.fields.domain.type).toEqual('String');
    expect(result.Email.fields.domain.isArray).toEqual(false);
    expect(result.Email.fields.domain.required).toEqual(false);

    expect(result.Person.fields.emails.type).toEqual('Email');
    expect(result.Person.fields.emails.isArray).toEqual(true);
    expect(result.Person.fields.emails.required).toEqual(false);

    expect(result.Person.fields.id.directives.uuid).toEqual({});
    expect(result.Person.fields.pk.directives.key.key).toEqual('Person');
    expect(result.Person.fields.sk.directives.key.key).toEqual('id:{{id}}');
    expect(result.Person.fields.pk.directives.key.type).toEqual('pk');
    expect(result.Person.fields.sk.directives.key.type).toEqual('sk');

    expect(result.Person.fields.addresses.type).toEqual('Address');
    expect(result.Person.fields.addresses.isArray).toEqual(true);
    expect(result.Person.fields.addresses.required).toEqual(true);
    expect(result.Person.fields.addresses.directives.hasMany.pk).toEqual(
      'Address',
    );
    expect(result.Person.fields.addresses.directives.hasMany.sk).toEqual(
      'personId:{{id}}',
    );
  });

  it('Should parse as expected', () => {
    const result = schemaToJson(schema);
    expect(result).toEqual(parsed);
  });
});
