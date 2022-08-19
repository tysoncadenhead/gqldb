import {getTypescriptType} from '../getTypescriptType';

describe('getTypescriptType', () => {
  it('Should return the correct typescript type', () => {
    expect(getTypescriptType('String')).toEqual('string');
    expect(getTypescriptType('Int')).toEqual('number');
    expect(getTypescriptType('Float')).toEqual('number');
    expect(getTypescriptType('Boolean')).toEqual('boolean');
    expect(getTypescriptType('ID')).toEqual('string');
    expect(getTypescriptType('Email')).toEqual('IEmail');
  });
});
