import {IOut} from 'graphqldb-types';
import {IProcessor} from '../types';
import {getModels} from '../selectors/getModels';
import {removeEmptyLines} from '../utils/removeEmptyLines';

export const functionsProcessor = ({json, prev}: IProcessor): IOut => {
  const models = getModels(json);

  return {
    ...prev,
    ts: removeEmptyLines(
      Object.keys(models).reduce((prev, current) => {
        return `${prev}
export const ${current} = {
  create: async (data: ICreate${current}) : Promise<I${current}> => {
    validate(validations.${current}, data);
    return relationshipsFor${current}(await getAdapter().create<ICreate${current}, I${current}>(optionsFor${current}, data));
  },
  update: async (data: IUpdate${current}) : Promise<I${current}> => {
    validate(validations.${current}, data);
    return relationshipsFor${current}(await getAdapter().update<IUpdate${current}, I${current}>(optionsFor${current}, data));
  },
  delete: async (data: I${current}Selectors) : Promise<I${current}> => {
    return relationshipsFor${current}(await getAdapter().delete<I${current}Selectors, I${current}>(optionsFor${current}, data));
  },
  find: async (data: I${current}Selectors) : Promise<I${current}> => {
    return relationshipsFor${current}(await getAdapter().find<I${current}Selectors, I${current}>(optionsFor${current}, data));
  },
  query: async (data: I${current}QuerySelectors) : Promise<IPaginated${current}> => {
    const result = await getAdapter().query<I${current}QuerySelectors, IPaginated${current}>(optionsFor${current}, data);
    return {
      ...result,
      items: result.items.map(relationshipsFor${current}),
    };
  },
${(models[current].directives.model?.indexes || [])
  .map((index) => {
    return `  query${index.name}: async (data: I${current}${index.name}QuerySelectors) : Promise<IPaginated${current}> => {
    const result = await getAdapter().queryByIndex<I${current}${index.name}QuerySelectors, IPaginated${current}>(optionsFor${current}, "${index.name}", data);
    return {
      ...result,
      items: result.items.map(relationshipsFor${current}),
    };
  }`;
  })
  .join(',\n')}
}`;
      }, prev.ts || ''),
    ),
  };
};
