import {Flattened, IOptions} from '../types';

export const generateResolvers = (options: IOptions, flattened: Flattened) => {
  if (!options.generateApi) {
    return '';
  }

  return `
const getArguments = <I> (a, b) : I => {
    return a?.context?.arguments?.input || b?.input;
};

export const resolvers = {
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
