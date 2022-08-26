import {IOut} from 'graphqldb-types';
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
  hooks?: {
    before?: (name: string, input: any) => any;
    after?: (name: string, input: any) => any;
  }
}

export const getResolvers = (resolverOptions?: IGetResolvers) => {
  const wrap = wrapResolver(resolverOptions);
  return {
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

      return `    ${item}: wrap("${current}.${item}", [Permissions["${toCamelCase(
        type,
      )}.read"]], async ({ ctx }) => {
        ${
          Object.keys(belongToMap).length
            ? `return await ${type}.find({${Object.keys(belongToMap).reduce(
                (prev, key) => {
                  return `${prev} ${belongToMap[key]}: ctx.${key}`;
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
                return `${prev} ${key}: ctx.${hasManyMap[key]}`;
              }, '')}});
        return result.items;`
            : ''
        }
      }),`;
    })
    .join('\n')}
    },`;
  }, ``)}
    Query: {
  ${Object.keys(models).reduce((prev, current) => {
    return `${prev}
      get${current}: wrap("Query.get${current}", [Permissions["${toCamelCase(
      current,
    )}.read"]], async ({ args }) =>
        await ${current}.find(args)
      ),
      query${current}Records: wrap("Query.query${current}Records", [Permissions["${toCamelCase(
      current,
    )}.read"]], async ({ args }) =>
        await ${current}.query(args)
      ),
      ${(models[current].directives.model.indexes || [])
        .map(
          (index) => `query${current}Records${
            index.name
          }: wrap("Query.query${current}Records${
            index.name
          }", [Permissions["${toCamelCase(current)}.read"]], async ({ args }) =>
        await ${current}.query${index.name}(args)
      ),`,
        )
        .join('\n')}`;
  }, ``)}
    },
    Mutation: {
  ${Object.keys(models).reduce((prev, current) => {
    return `${prev}
      create${current}: wrap("Mutation.create${current}", [Permissions["${toCamelCase(
      current,
    )}.create"]], async ({ args }) => 
        await ${current}.create(args)
      ),
      update${current}: wrap("Mutation.update${current}", [Permissions["${toCamelCase(
      current,
    )}.update"]], async ({ args }) =>
        await ${current}.update(args)
      ),
      delete${current}: wrap("Mutation.delete${current}", [Permissions["${toCamelCase(
      current,
    )}.delete"]], async ({ args }) =>
        await ${current}.delete(args)
      ),`;
  }, ``)}
    },
  };
};

export const getTypeDefs = () => fs.readFileSync(path.resolve(__dirname, './schema.graphql'), 'utf8');`),
  };
};
