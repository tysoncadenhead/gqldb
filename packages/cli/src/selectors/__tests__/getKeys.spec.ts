import {KeyType} from '../../types';
import {getKeys} from '../getKeys';

describe('getKeys', () => {
  it('Should filter out fields that are not keys', () => {
    const result = getKeys({
      Person: {
        directives: {},
        fields: {
          myPk: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {
              key: {
                key: 'key:{{id}}',
                type: KeyType.pk,
              },
            },
          },
          mySk: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {
              key: {
                key: 'key:{{id}}',
                type: KeyType.sk,
              },
            },
          },
          myKey: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {
              key: {
                key: 'key:{{id}}',
              },
            },
          },
        },
      },
    });

    expect(result.Person.myKey).toEqual({
      key: 'key:{{id}}',
    });
    expect(result.Person.myPk).toEqual({
      key: 'key:{{id}}',
      type: KeyType.pk,
    });
    expect(result.Person.mySk).toEqual({
      key: 'key:{{id}}',
      type: KeyType.sk,
    });
  });
});
