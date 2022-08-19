import {ISchemaJson, KeyType} from '../../types';
import {functionsProcessor} from '../functionsProcessor';

describe('functionsProcessor', () => {
  it('Should return the functions', () => {
    const expected = `export const Person = {
  create: async (data: ICreatePerson) : Promise<IPerson> => {
    validate(validations.Person, data);
    return relationshipsForPerson(await getAdapter().create<ICreatePerson, IPerson>(optionsForPerson, data));
  },
  update: async (data: IUpdatePerson) : Promise<IPerson> => {
    validate(validations.Person, data);
    return relationshipsForPerson(await getAdapter().update<IUpdatePerson, IPerson>(optionsForPerson, data));
  },
  delete: async (data: IPersonSelectors) : Promise<IPerson> => {
    return relationshipsForPerson(await getAdapter().delete<IPersonSelectors, IPerson>(optionsForPerson, data));
  },
  find: async (data: IPersonSelectors) : Promise<IPerson> => {
    return relationshipsForPerson(await getAdapter().find<IPersonSelectors, IPerson>(optionsForPerson, data));
  },
  query: async (data: IPersonQuerySelectors) : Promise<IPaginatedPerson> => {
    const result = await getAdapter().query<IPersonQuerySelectors, IPaginatedPerson>(optionsForPerson, data);
    return {
      ...result,
      items: result.items.map(relationshipsForPerson),
    };
  },
  queryByFirstName: async (data: IPersonByFirstNameQuerySelectors) : Promise<IPaginatedPerson> => {
    const result = await getAdapter().queryByIndex<IPersonByFirstNameQuerySelectors, IPaginatedPerson>(optionsForPerson, "ByFirstName", data);
    return {
      ...result,
      items: result.items.map(relationshipsForPerson),
    };
  }
}`;

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

    const result = functionsProcessor({
      json,
      prev: {},
      options: {},
    });

    expect(result.ts).toEqual(expected);
  });
});
