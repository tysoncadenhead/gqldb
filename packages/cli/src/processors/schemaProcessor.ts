import {IOut} from '@graphqldb/types';
import {getIndexArgs} from '../utils/getIndexArgs';
import {IProcessor} from '../types';
import {getModels} from '../selectors/getModels';
import {getObjectTypes} from '../selectors/getObjectTypes';
import {getSelectors} from '../selectors/getSelectors';
import {removeEmptyLines} from '../utils/removeEmptyLines';

export const schemaProcessor = ({options, json, prev}: IProcessor): IOut => {
  if (!options.generateApi) {
    return prev;
  }

  const models = getModels(json);
  const objectTypes = getObjectTypes(json);
  const selectors = getSelectors(json);
  const hasModels = !!Object.keys(models).length;

  const generatedSchema = `
${Object.keys(objectTypes)
  .map((current) => {
    const model = objectTypes[current];
    return `input ${current}Input {
${Object.keys(model.fields)
  .map((item) => {
    const {required, isArray, type} = model.fields[item];
    const isObjectType = !!objectTypes[type];
    return `   ${item}: ${isArray ? `[` : ''}${type}${
      isObjectType ? 'Input' : ''
    }${required ? '!' : ''}${isArray ? `]${required ? '!' : ''}` : ''}`;
  })
  .join('\n')}
}`;
  })
  .join('\n')}
${Object.keys(objectTypes)
  .map((current) => {
    return `type ${current} {
  ${Object.keys(objectTypes[current].fields)
    .map((item) => {
      const {required, isArray, type} = objectTypes[current].fields[item];
      return `   ${item}: ${isArray ? `[` : ''}${type}${required ? '!' : ''}${
        isArray ? `]${required ? '!' : ''}` : ''
      }`;
    })
    .join('\n')}
}`;
  })
  .join('\n')}
${Object.keys(models).reduce((prev, current) => {
  const model = models[current];

  return `${prev}
type Paginated${current} {
    limit: Int!
    lastKey: String
    items: [${current}!]!
}

type ${current} {
${Object.keys(model.fields)
  .map((item) => {
    const {required, isArray, type} = model.fields[item];
    return `   ${item}: ${isArray ? `[` : ''}${type}${required ? '!' : ''}${
      isArray ? `]${required ? '!' : ''}` : ''
    }`;
  })
  .join('\n')}
}

input Get${current}Input {
${Object.keys(model.fields)
  .filter((item) => {
    return selectors[current].fields.includes(item);
  })
  .map((item) => {
    const {required, isArray, type} = model.fields[item];
    return `   ${item}: ${isArray ? `[` : ''}${type}${required ? '!' : ''}${
      isArray ? `]${required ? '!' : ''}` : ''
    }`;
  })
  .join('\n')}
}

input Delete${current}Input {
${Object.keys(model.fields)
  .filter((item) => {
    return selectors[current].fields.includes(item);
  })
  .map((item) => {
    const {required, isArray, type} = model.fields[item];
    return `   ${item}: ${isArray ? `[` : ''}${type}${required ? '!' : ''}${
      isArray ? `]${required ? '!' : ''}` : ''
    }`;
  })
  .join('\n')}
}

${(models[current].directives.model.indexes || [])
  .map((index) => {
    const args = getIndexArgs(models[current], index);

    return `input Query${current}Records${index.name}Input {
   limit: Int
   startKey: String
${Object.keys(model.fields)
  .filter((item) => {
    return args.includes(item);
  })
  .map((item) => {
    const {type} = model.fields[item];
    return `   ${item}: ${type}`;
  })
  .join('\n')}
}`;
  })
  .join(',\n')}

input Query${current}RecordsInput {
   limit: Int
   startKey: String
${Object.keys(model.fields)
  .filter((item) => {
    return selectors[current].fields[item];
  })
  .map((item) => {
    const {key, originalType} = model[item];
    return `   ${key}: ${originalType}`;
  })
  .join('\n')}    
}

input Create${current}Input {
${Object.keys(model.fields)
  .filter((item) => {
    const {type} = model.fields[item];
    return !Object.keys(models)
      .map((key) => `I${key}`)
      .includes(type);
  })
  .filter((item) => {
    return (
      !model.fields[item].directives.uuid &&
      !model.fields[item].directives.key &&
      !model.fields[item].directives.hasMany &&
      !model.fields[item].directives.belongsTo
    );
  })
  .map((item) => {
    const {required, isArray, type} = model.fields[item];
    const isObjectType = !!objectTypes[type];
    return `   ${item}: ${isArray ? `[` : ''}${type}${
      isObjectType ? 'Input' : ''
    }${required ? '!' : ''}${isArray ? `]${required ? '!' : ''}` : ''}`;
  })
  .join('\n')}
}

input Update${current}Input {
${Object.keys(model.fields)
  .filter((item) => {
    return (
      !model.fields[item].directives.key &&
      !model.fields[item].directives.hasMany &&
      !model.fields[item].directives.belongsTo
    );
  })
  .map((item) => {
    const {required, isArray, type} = model.fields[item];
    const isObjectType = !!objectTypes[type];
    return `   ${item}: ${isArray ? `[` : ''}${type}${
      isObjectType ? 'Input' : ''
    }${required ? '!' : ''}${isArray ? `]${required ? '!' : ''}` : ''}`;
  })
  .join('\n')}
}`;
}, ``)}
${
  hasModels
    ? `
type Query {
${Object.keys(models)
  .map((current) => {
    return `    get${current} (input: Get${current}Input!) : ${current}!
    query${current}Records (input: Query${current}RecordsInput!): Paginated${current}!
${(models[current].directives.model.indexes || [])
  .map(
    (index) =>
      `   query${current}Records${index.name} (input: Query${current}Records${index.name}Input!): Paginated${current}!`,
  )
  .join('\n')}`;
  })
  .join('\n')}
}

type Mutation {
${Object.keys(models)
  .map((current) => {
    return `    create${current} (input: Create${current}Input!) : ${current}!
    update${current} (input: Update${current}Input!) : ${current}!
    delete${current} (input: Delete${current}Input!) : ${current}!`;
  })
  .join('\n')}`
    : ''
}
}`;

  return {
    ...prev,
    schema: removeEmptyLines(`
#THIS IS A GENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
${prev.schema ? [prev.schema, generatedSchema].join('\n') : generatedSchema}`),
  };
};
