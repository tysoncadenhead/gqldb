import {validationsProcessor} from '../validationsProcessor';
import {ISchemaJson} from '../../types';

describe('validationsProcessor', () => {
  it('should return the validations', () => {
    const json: ISchemaJson = {
      Person: {
        directives: {
          model: {},
        },
        fields: {
          firstName: {
            type: 'String',
            required: true,
            directives: {
              constraint: {
                minLength: 3,
              },
            },
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
    const result = validationsProcessor({
      json,
      prev: {},
      options: {},
    });
    expect(result).toEqual({
      ts: `
const validations = {\"Person\":{\"firstName\":{\"minLength\":3},\"lastName\":{}}};`,
    });
  });
});
