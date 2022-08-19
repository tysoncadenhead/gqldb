import {ISchemaJson, KeyType} from '../../types';
import {optionsProcessor} from '../optionsProcessor';

describe('optionsProcessor', () => {
  it('Should return the options', () => {
    const expected = `const optionsForPerson = {
    model: 'Person',
    tableName: 'foo-table',
    indexes: [
  {
    "name": "ByFirstName",
    "pk": "pk",
    "sk": "gsi1",
    "index": "gsi1index"
  }
],
    keys: [{\"key\":\"pk\",\"type\":\"pk\",\"value\":\"Address\",\"fields\":[]},{\"key\":\"sk\",\"type\":\"sk\",\"value\":\"personId:{{personId}}|id:{{id}}\",\"fields\":[\"personId\",\"id\"]},{\"key\":\"gsi1\",\"type\":\"default\",\"value\":\"firstName:{{firstName}}|id:{{id}}\",\"fields\":[\"firstName\",\"id\"]}],
};`;
    const json: ISchemaJson = {
      Person: {
        directives: {
          model: {
            indexes: [
              {
                name: 'ByFirstName',
                pk: 'pk',
                sk: 'gsi1',
                index: 'gsi1index',
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
                key: 'firstName:{{firstName}}|id:{{id}}',
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

    const result = optionsProcessor({
      prev: {},
      json,
      options: {
        tableName: 'foo-table',
      },
    });

    expect(result).toEqual({
      ts: expected,
    });
  });
});
