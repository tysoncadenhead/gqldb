import {Flattened, IOptions, ISelectors, IModelSettings} from '../types';
import {getIndexArgs} from './utils/getIndexArgs';

export const generateSchema = (
  schemaString: string,
  options: IOptions,
  flattened: Flattened,
  selectors: ISelectors,
  modelSettings: IModelSettings,
) => {
  if (!options.generateApi) {
    return '';
  }

  const generatedSchema = `

${Object.keys(flattened).reduce((prev, current) => {
  const model = flattened[current];

  return `${prev}
type Paginated${current} {
    limit: Int!
    lastKey: String
    items: [${current}!]!
}

input Get${current}Input {
${Object.keys(model)
  .filter((item) => {
    return selectors[current].fields.includes(model[item].key);
  })
  .filter((item) => {
    const {type} = model[item];
    return type !== 'key';
  })
  .map((item) => {
    const {key, originalType, required} = model[item];
    return `   ${key}: ${originalType}${required ? '!' : ''}`;
  })
  .join('\n')}
}

input Delete${current}Input {
${Object.keys(model)
  .filter((item) => {
    return selectors[current].fields.includes(model[item].key);
  })
  .map((item) => {
    const {key, originalType, required} = model[item];
    return `   ${key}: ${originalType}${required ? '!' : ''}`;
  })
  .join('\n')}
}

${modelSettings[current].indexes
  .map((index) => {
    const args = getIndexArgs(current, index, selectors);

    return `input Query${current}Records${index.name}Input {
   limit: Int
   startKey: String
${Object.keys(model)
  .filter((item) => {
    return args.includes(model[item].key);
  })
  .map((item) => {
    const {key, originalType} = model[item];
    return `   ${key}: ${originalType}`;
  })
  .join('\n')}
}`;
  })
  .join(',\n')}

input Query${current}RecordsInput {
   limit: Int
   startKey: String
${Object.keys(model)
  .filter((item) => {
    return selectors[current].fields.includes(model[item].key);
  })
  .map((item) => {
    const {key, originalType} = model[item];
    return `   ${key}: ${originalType}`;
  })
  .join('\n')}    
}

input Create${current}Input {
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
    const {key, originalType, required} = model[item];
    return `   ${key}: ${originalType}${required ? '!' : ''}`;
  })
  .join('\n')}
}

input Update${current}Input {
${Object.keys(model)
  .filter((item) => {
    const {type} = model[item];
    return !Object.keys(flattened)
      .map((key) => `I${key}`)
      .includes(type);
  })
  .map((item) => {
    const {key, originalType, required} = model[item];
    return `   ${key}: ${originalType}${required ? '!' : ''}`;
  })
  .join('\n')}
}`;
}, ``)}

type Query {
${Object.keys(flattened).reduce((prev, current) => {
  return `${prev}
    get${current} (input: Get${current}Input!) : ${current}!
    query${current}Records (input: Query${current}RecordsInput!): Paginated${current}!
    ${modelSettings[current].indexes
      .map(
        (index) =>
          `query${current}Records${index.name} (input: Query${current}Records${index.name}Input!): Paginated${current}!`,
      )
      .join('\n')}`;
}, ``)}
}

type Mutation {
${Object.keys(flattened).reduce((prev, current) => {
  return `${prev}
    create${current} (input: Create${current}Input!) : ${current}!
    update${current} (input: Update${current}Input!) : ${current}!
    delete${current} (input: Delete${current}Input!) : ${current}!`;
}, ``)}
}`;

  return `#THIS IS A GENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
${schemaString}${generatedSchema}`;
};
