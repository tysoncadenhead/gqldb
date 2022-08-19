import {KeyType} from '../../types';
import {getSelectors} from '../getSelectors';

describe('getSelectors', () => {
  it('Should get the correct selectors', () => {
    const result = getSelectors({
      Person: {
        directives: {
          model: {},
        },
        fields: {
          myPk: {
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
          id: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {},
          },
        },
      },
    });

    expect(result.Person.fields).toEqual(['id']);
    expect(result.Person.keys[0].type).toEqual('pk');
    expect(result.Person.keys[0].key).toEqual('myPk');
    expect(result.Person.keys[0].value).toEqual('Person');
    expect(result.Person.keys[1].type).toEqual('sk');
    expect(result.Person.keys[1].key).toEqual('mySk');
    expect(result.Person.keys[1].value).toEqual('key:{{id}}');
  });
});
