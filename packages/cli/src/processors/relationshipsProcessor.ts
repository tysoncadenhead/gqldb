import {IOut} from 'graphqldb-types';
import {IProcessor} from '../types';
import {getModels} from '../selectors/getModels';
import {getRelationships} from '../selectors/getRelationships';
import {removeEmptyLines} from '../utils/removeEmptyLines';
import {getKeysForRelationship} from '../selectors/getKeysForRelationship';

export const relationshipsProcessor = ({json, prev}: IProcessor): IOut => {
  const models = getModels(json);
  const relationships = getRelationships(json);

  return {
    ...prev,
    ts: removeEmptyLines(`${prev.ts || ''}
${Object.keys(models)
  .map((current) => {
    return `const relationshipsFor${current} = (data: I${current}) => ({
  ...data,
${Object.keys(relationships[current].fields)
  .map((item) => {
    const {type, directives} = relationships[current].fields[item];
    const belongToMap = directives.belongsTo
      ? getKeysForRelationship(directives.belongsTo, models[type])
      : {};
    const hasManyMap = directives.hasMany
      ? getKeysForRelationship(directives.hasMany, models[type])
      : {};

    return Object.keys(belongToMap).length
      ? `  ${item}: async () => {
    return await ${type}.find({ ${Object.keys(belongToMap)
          .map((belongsToKey) => {
            return `${belongToMap[belongsToKey]}: data.${belongsToKey}`;
          })
          .join(`, `)} });
  },`
      : Object.keys(hasManyMap).length
      ? `  ${item}: async () => {
    const result = await ${type}.query({ ${Object.keys(hasManyMap)
          .filter((hasManyKey) => {
            return !!hasManyMap[hasManyKey] && !!hasManyKey;
          })
          .map((hasManyKey) => {
            return `${hasManyMap[hasManyKey]}: data.${hasManyKey}`;
          })
          .join(`, `)} });
    return result.items;
  },`
      : ``;
  })
  .join('\n')}
})`;
  })
  .join('\n')}`),
  };
};
