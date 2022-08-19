import {objectInterfacesProcessor} from '../objectInterfacesProcessor';

describe('objectInterfacesProcessor', () => {
  it('Should create object interfaces', () => {
    const expected = `interface IPerson {
  id: string;
}`;
    const json = {
      Person: {
        directives: {},
        fields: {
          id: {
            type: 'ID',
            required: true,
            isArray: false,
            directives: {},
          },
        },
      },
    };
    const result = objectInterfacesProcessor({
      prev: {},
      json,
      options: {
        generateApi: true,
      },
    });
    expect(result.ts).toEqual(expected);
  });
});
