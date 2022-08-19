import {getRelationships} from '../getRelationships';

describe('getRelationships', () => {
  it('Should filter out fields that are not relationships', () => {
    const city = {
      type: 'String',
      required: true,
      isArray: false,
      directives: {
        belongsTo: {
          pk: 'City',
          sk: 'key:{{id}}',
        },
      },
    };
    const pets = {
      type: 'String',
      required: true,
      isArray: true,
      directives: {
        hasMany: {
          pk: 'Pet',
          sk: 'key:{{id}}',
        },
      },
    };
    const result = getRelationships({
      Person: {
        directives: {},
        fields: {
          city,
          pets,
          firstName: {
            type: 'String',
            required: true,
            isArray: false,
            directives: {},
          },
        },
      },
    });

    expect(result.Person.fields.city).toEqual(city);
    expect(result.Person.fields.pets).toEqual(pets);
    expect(result.Person.fields.firstName).toBeFalsy();
  });
});
