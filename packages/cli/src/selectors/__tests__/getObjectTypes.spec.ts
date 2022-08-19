import {getObjectTypes} from '../getObjectTypes';

describe('getObjectTypes', () => {
  it('Should filter out types that are models', () => {
    const result = getObjectTypes({
      Email: {
        directives: {},
        fields: {},
      },
      Person: {
        directives: {
          model: {},
        },
        fields: {},
      },
    });

    expect(result.Person).toBeFalsy();
    expect(result.Email).toBeTruthy();
  });
});
