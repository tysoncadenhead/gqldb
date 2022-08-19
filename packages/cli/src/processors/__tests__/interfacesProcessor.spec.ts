import {KeyType} from '../../types';
import {interfacesProcessor} from '../interfacesProcessor';

describe('interfacesProcessor', () => {
  it('Should generate the typescript interfaces', () => {
    const expected = `interface IPerson {
    id: string;
    firstName: string;
    lastName: string;
}
interface IUpdatePerson {
    id: string;
    firstName: string;
    lastName: string;
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
    id: string;
    firstName: string;
    lastName: string;
}`;

    const json = {
      Person: {
        directives: {
          model: {},
        },
        fields: {
          id: {
            type: 'ID',
            required: true,
            isArray: false,
            directives: {},
          },
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

    const result = interfacesProcessor({
      json,
      prev: {},
      options: {},
    });

    expect(result).toEqual({
      ts: expected,
    });
  });
});
