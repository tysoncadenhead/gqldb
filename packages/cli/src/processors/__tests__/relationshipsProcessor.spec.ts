import {ISchemaJson, KeyType} from '../../types';
import {relationshipsProcessor} from '../relationshipsProcessor';

describe('relationshipsProcessor', () => {
  it('Should return the relationships', () => {
    const expected = `const relationshipsForAddress = (data: IAddress) => ({
  ...data,
  person: async () => {
    return await Person.find({ id: data.personId });
  },
})
const relationshipsForPerson = (data: IPerson) => ({
  ...data,
  addresses: async () => {
    const result = await Address.query({ personId: data.id });
    return result.items;
  },
})`;

    const json: ISchemaJson = {
      Address: {
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
                key: 'person:{{personId}}|id:{{id}}',
                type: KeyType.sk,
              },
            },
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
          id: {
            type: 'ID',
            required: true,
            isArray: false,
            directives: {
              uuid: {},
            },
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
          addresses: {
            type: 'Address',
            required: true,
            isArray: true,
            directives: {
              hasMany: {
                pk: 'Address',
                sk: 'personId:{{id}}',
              },
            },
          },
        },
      },
    };

    const result = relationshipsProcessor({
      prev: {},
      json,
      options: {
        tableName: 'foo-table',
      },
    });

    expect(result.ts).toEqual(expected);
  });
});
