import {getModels} from '../getModels';

describe('getModels', () => {
  it('Should filter out types that are not models', () => {
    const result = getModels({
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

    expect(result.Person).toBeTruthy();
    expect(result.Email).toBeFalsy();
  });
});
