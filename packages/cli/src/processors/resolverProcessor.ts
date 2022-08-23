import {IOut} from '@graphqldb/types';
import {toCamelCase} from '../utils/toCamelCase';
import {IProcessor} from '../types';
import {getModels} from '../selectors/getModels';
import {getRelationships} from '../selectors/getRelationships';
import {removeEmptyLines} from '../utils/removeEmptyLines';
import {getKeys} from '../selectors/getKeys';
import {getKeysForRelationship} from '../selectors/getKeysForRelationship';

export const resolverProcessor = ({options, json, prev}: IProcessor): IOut => {
  if (!options.generateApi) {
    return prev;
  }

  const models = getModels(json);
  const relationships = getRelationships(json);
  const keys = getKeys(json);

  return {
    ...prev,
    ts: removeEmptyLines(`${prev?.ts || ''}
interface IGetResolvers {
  checkPermissions?: (permissions: Permissions[], ctx: any) => boolean;
}

export const getResolvers = (resolverOptions?: IGetResolvers) => ({
${Object.keys(models).reduce((prev, current) => {
  return `${prev}
  ${current}: {
${Object.keys(relationships[current].fields)
  .map((item) => {
    const {type, directives} = relationships[current].fields[item];
    const belongToMap = directives.belongsTo
      ? getKeysForRelationship(directives.belongsTo, models[type])
      : {};
    const hasManyMap = directives.hasMany
      ? getKeysForRelationship(directives.hasMany, models[type])
      : {};

    return `    ${item}: async (ctx) => {
      checkPermissions([Permissions["${toCamelCase(
        type,
      )}.read"]], ctx, resolverOptions?.checkPermissions);
      ${
        Object.keys(belongToMap).length
          ? `return await ${type}.find({${Object.keys(belongToMap).reduce(
              (prev, key) => {
                return `${prev} ${belongToMap[key]}: ctx.${key},`;
              },
              '',
            )}})`
          : ''
      }
      ${
        Object.keys(hasManyMap).length
          ? `const result = await ${type}.query({${Object.keys(
              hasManyMap,
            ).reduce((prev, key) => {
              return `${prev} ${key}: ctx.${hasManyMap[key]},`;
            }, '')}});
      return result.items;`
          : ''
      }
    },`;
  })
  .join('\n')}
  },`;
}, ``)}
  Query: {
${Object.keys(models).reduce((prev, current) => {
  return `${prev}
    get${current}: async (a, b) => {
      const args = getArguments<I${current}Selectors>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions["${toCamelCase(
        current,
      )}.read"]], ctx, resolverOptions?.checkPermissions);
      return await ${current}.find(args);
    },
    query${current}Records: async (a, b) => {
      const args = getArguments<I${current}QuerySelectors>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions["${toCamelCase(
        current,
      )}.read"]], ctx, resolverOptions?.checkPermissions);
      return await ${current}.query(args);
    },
    ${(models[current].directives.model.indexes || [])
      .map(
        (index) => `query${current}Records${index.name}: async (a, b) => {
      const args = getArguments<I${current}${index.name}QuerySelectors>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions["${toCamelCase(
        current,
      )}.read"]], ctx, resolverOptions?.checkPermissions);
      return await ${current}.query${index.name}(args);
    },`,
      )
      .join('\n')}`;
}, ``)}
  },
  Mutation: {
${Object.keys(models).reduce((prev, current) => {
  return `${prev}
    create${current}: async (a, b) => {
      const args = getArguments<ICreate${current}>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions["${toCamelCase(
        current,
      )}.create"]], ctx, resolverOptions?.checkPermissions);
      return await ${current}.create(args);
    },
    update${current}: async (a, b) => {
      const args = getArguments<IUpdate${current}>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions["${toCamelCase(
        current,
      )}.update"]], ctx, resolverOptions?.checkPermissions);
      return await ${current}.update(args);
    },
    delete${current}: async (a, b) => {
      const args = getArguments<I${current}Selectors>(a, b);
      const ctx = getContext(a);
      checkPermissions([Permissions["${toCamelCase(
        current,
      )}.delete"]], ctx, resolverOptions?.checkPermissions);
      return await ${current}.delete(args);
    },`;
}, ``)}
  },
});

export const getTypeDefs = () => fs.readFileSync(path.resolve(__dirname, './schema.graphql'), 'utf8');`),
  };
};
