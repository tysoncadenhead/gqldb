import {importsProcessor} from '../importsProcessor';

describe('objectInterfacesProcessor', () => {
  it('Should the imports', () => {
    const expected = `// THIS IS A GENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
import * as fs from 'fs';
import * as path from 'path';
import adapter from 'graphqldb-adapter-memory';
import { setAdapter, getAdapter, validate, wrapResolver } from 'graphqldb-client';
setAdapter(adapter);`;

    const result = importsProcessor({
      prev: {},
      json: {},
      options: {
        generateApi: true,
      },
    });
    expect(result.ts).toEqual(expected);
  });
});
