import {
  Flattened,
  ISelectors,
  IModelSettings,
  IRelationships,
  IOptions,
} from '../types';

const generateInterfaces = (
  flattened: Flattened,
  selectors: ISelectors,
  relationships: IRelationships,
) => {
  return Object.keys(flattened).reduce((prev, current) => {
    const model = flattened[current];
    return `${prev}

interface I${current} {
${Object.keys(model)
  .map((item) => {
    const {key, type, required} = model[item];
    return `   ${key}${required ? '' : '?'}: ${type};`;
  })
  .join('\n')}
${Object.keys(relationships[current])
  .map((item) => {
    const {type, tsType} = relationships[current][item];

    return `   ${item}: () => Promise<${tsType}${
      type === 'hasMany' ? '[]' : ''
    }>;`;
  })
  .join('\n')}
}

interface IUpdate${current} {
${Object.keys(model)
  .filter((item) => {
    const {type} = model[item];
    return !Object.keys(flattened)
      .map((key) => `I${key}`)
      .includes(type);
  })
  .map((item) => {
    const {key, type, required} = model[item];
    return `   ${key}${required ? '' : '?'}: ${type};`;
  })
  .join('\n')}
}

interface I${current}Selectors {
${Object.keys(model)
  .filter((item) => {
    return selectors[current].fields.includes(model[item].key);
  })
  .map((item) => {
    const {key, type, required} = model[item];
    return `   ${key}${required ? '' : '?'}: ${type};`;
  })
  .join('\n')}
}

interface I${current}QuerySelectors {
   limit?: number;
   startKey?: string;
${Object.keys(model)
  .filter((item) => {
    return selectors[current].fields.includes(model[item].key);
  })
  .map((item) => {
    const {key, type} = model[item];
    return `   ${key}?: ${type};`;
  })
  .join('\n')}
}

interface IPaginated${current} {
  items: I${current}[];
  lastKey: string | null;
  limit: number;
}

interface ICreate${current} {
${Object.keys(model)
  .filter((item) => {
    const {type} = model[item];
    return !Object.keys(flattened)
      .map((key) => `I${key}`)
      .includes(type);
  })
  .filter((item) => {
    const {generated} = model[item];
    return !generated;
  })
  .map((item) => {
    const {key, type, required} = model[item];
    return `   ${key}${required ? '' : '?'}: ${type};`;
  })
  .join('\n')}
}`;
  }, '');
};

const generateFunctions = (
  flattened: Flattened,
  modelSettings: IModelSettings,
  selectors: ISelectors,
  relationships: IRelationships,
) => {
  return Object.keys(flattened).reduce((prev, current) => {
    return `${prev}
const optionsFor${current} = {
  model: '${current}',
  tableName: '${modelSettings[current].tableName}',
  keys: ${JSON.stringify(
    selectors[current].keys.map((dbKey) => ({
      ...dbKey,
      fields: selectors[current].fields,
    })),
  )},
};

const relationshipsFor${current} = (data: I${current}) => {
  return {
    ...data,
${Object.keys(relationships[current])
  .map((item) => {
    const {type, objectType, keys} = relationships[current][item];

    return `   ${item}: async () => {
      ${
        type === 'belongsTo' || type === 'hasOne'
          ? `return await ${objectType}.find({${Object.keys(keys).reduce(
              (prev, i) => {
                return `${prev} ${[selectors[objectType].fields[i]]}: data.${
                  keys[i]
                },`;
              },
              '',
            )}})`
          : type === 'hasMany'
          ? `const result = await ${objectType}.query({${Object.keys(
              keys,
            ).reduce((prev, i) => {
              return `${prev} ${[selectors[objectType].fields[i]]}: data.${
                keys[i]
              },`;
            }, '')}});
            return result.items;`
          : ''
      }
    },`;
  })
  .join('\n')}
  };
};

export const ${current} = {
  create: async (data: ICreate${current}) : Promise<I${current}> => {
    return relationshipsFor${current}(await getAdapter().create<ICreate${current}, I${current}>(optionsFor${current}, data));
  },
  update: async (data: IUpdate${current}) : Promise<I${current}> => {
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
}
`;
  }, '');
};

export const generateTypescript = (
  options: IOptions,
  flattened: Flattened,
  selectors: ISelectors,
  modelSettings: IModelSettings,
  relationships: IRelationships,
) => {
  return `// THIS IS A GENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
import { getAdapter } from '../';
${generateInterfaces(flattened, selectors, relationships)}
${generateFunctions(flattened, modelSettings, selectors, relationships)}`;
};
