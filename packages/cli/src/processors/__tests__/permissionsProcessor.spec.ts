import {permissionsProcessor} from '../permissionsProcessor';

describe('permissionsProcessor', () => {
  it('Should create permissions for a model', () => {
    const expected = `export enum Permissions {
    \"person.create\" = \"person.create\",
    \"person.update\" = \"person.update\",
    \"person.delete\" = \"person.delete\",
    \"person.read\" = \"person.read\",
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
        },
      },
    };
    const result = permissionsProcessor({
      prev: {},
      json,
      options: {
        generateApi: true,
      },
    });
    expect(result.ts).toEqual(expected);
  });
});
