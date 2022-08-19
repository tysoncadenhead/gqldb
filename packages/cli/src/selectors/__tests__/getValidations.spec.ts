import {getValidations} from '../getValidations';

describe('getValidations', () => {
  it('Should filter out types that are not models', () => {
    const result = getValidations({
      Email: {
        directives: {},
        fields: {
          address: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {
              constraint: {
                startsWith: 'foo',
              },
            },
          },
        },
      },
    });

    expect(result).toEqual({
      Email: {
        address: {
          startsWith: 'foo',
        },
      },
    });
  });
});
