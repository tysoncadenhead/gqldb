import {Flattened, IOptions, IRelationships, ISelectors} from '../types';

export const generateResolvers = (
  options: IOptions,
  flattened: Flattened,
  selectors: ISelectors,
  relationships: IRelationships,
) => {
  if (!options.generateApi) {
    return '';
  }

  return `
const getArguments = <I> (a, b) : I => {
    return a?.context?.arguments?.input || b?.input;
};

export const resolvers = {

    ${Object.keys(flattened).reduce((prev, current) => {
      return `${prev}
      ${current}: {
        ${Object.keys(relationships[current])
          .map((item) => {
            const {type, objectType, keys} = relationships[current][item];

            return `   ${item}: async (ctx) => {
                ${
                  type === 'belongsTo' || type === 'hasOne'
                    ? `return await ${objectType}.find({${Object.keys(
                        keys,
                      ).reduce((prev, i) => {
                        return `${prev} ${[
                          selectors[objectType].fields[i],
                        ]}: ctx.${keys[i]},`;
                      }, '')}})`
                    : type === 'hasMany'
                    ? `const result = await ${objectType}.query({${Object.keys(
                        keys,
                      ).reduce((prev, i) => {
                        return `${prev} ${[
                          selectors[objectType].fields[i],
                        ]}: ctx.${keys[i]},`;
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
            return await ${current}.find(args);
        },
        query${current}Records: async (a, b) => {
            const args = getArguments<I${current}QuerySelectors>(a, b);
            return await ${current}.query(args);
        },`;
        }, ``)}
    },
    Mutation: {
        ${Object.keys(flattened).reduce((prev, current) => {
          return `${prev}
        create${current}: async (a, b) => {
            const args = getArguments<ICreate${current}>(a, b);
            return await ${current}.create(args);
        },
        update${current}: async (a, b) => {
            const args = getArguments<IUpdate${current}>(a, b);
            return await ${current}.update(args);
        },
        delete${current}: async (a, b) => {
            const args = getArguments<I${current}Selectors>(a, b);
            return await ${current}.delete(args);
        },`;
        }, ``)}
    },
};`;
};
