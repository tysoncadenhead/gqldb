import {ISchemaJson, KeyType} from '../../types';
import {resolverProcessor} from '../resolverProcessor';

describe('resolverProcessor', () => {
  it('should return the resolvers', () => {
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
    expect(result.ts).toBeTruthy();
  });

  it('Should convert the full db schema', () => {
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
    expect(result.ts).toBeTruthy();
  });
});
