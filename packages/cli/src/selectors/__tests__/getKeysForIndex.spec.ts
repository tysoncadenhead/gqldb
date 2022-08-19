import {KeyType} from '../../types';
import {getKeysForIndex} from '../getKeysForIndex';

describe('getKeysForIndex', () => {
  it('Should get the keys for an index', () => {
    const result = getKeysForIndex(
      {
        name: 'ByState',
        index: 'gsi1index',
        pk: 'pk',
        sk: 'gsi1',
      },
      {
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
        },
        directives: {},
      },
    );

    expect(result).toEqual({
      fields: ['state', 'city', 'id'],
      pk: {field: 'pk', key: 'Address', fields: []},
      sk: {
        field: 'gsi1',
        key: 'state:{{state}}|city:{{city}}|id:{{id}}',
        fields: ['state', 'city', 'id'],
      },
    });
  });
});
