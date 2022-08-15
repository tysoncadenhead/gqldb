import {
  Flattened,
  IOptions,
  IRelationships,
  ISelectors,
  IModelSettings,
} from '@graphqldb/types';
import {toCamelCase} from '../utils/toCamelCase';

export const generateResolvers = (
  options: IOptions,
  flattened: Flattened,
  selectors: ISelectors,
  relationships: IRelationships,
  modelSettings: IModelSettings,
) => {
  if (!options.generateApi) {
    return '';
  }

  return `
interface IGetResolvers {
  checkPermissions: (permissions: Permissions[], ctx: any) => boolean;
}

export const getResolvers = (resolverOptions?: IGetResolvers) => ({
${Object.keys(flattened).reduce((prev, current) => {
  return `${prev}
  ${current}: {
${Object.keys(relationships[current])
  .map((item) => {
    const {type, objectType, keys} = relationships[current][item];

    return `    ${item}: async (ctx) => {
      checkPermissions([Permissions["${toCamelCase(
        objectType,
      )}.read"]], ctx, resolverOptions?.checkPermissions);
      ${
        type === 'belongsTo' || type === 'hasOne'
          ? `return await ${objectType}.find({${Object.keys(keys).reduce(
              (prev, i) => {
                return `${prev} ${[selectors[objectType].fields[i]]}: ctx.${
                  keys[i]
                },`;
              },
              '',
            )}})`
          : type === 'hasMany'
          ? `const result = await ${objectType}.query({${Object.keys(
              keys,
            ).reduce((prev, i) => {
              return `${prev} ${[selectors[objectType].fields[i]]}: ctx.${
                keys[i]
              },`;
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
${Object.keys(flattened).reduce((prev, current) => {
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
    ${modelSettings[current].indexes
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
${Object.keys(flattened).reduce((prev, current) => {
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

export const getTypeDefs = () => fs.readFileSync(path.resolve(__dirname, './schema.graphql'), 'utf8');`;
};
