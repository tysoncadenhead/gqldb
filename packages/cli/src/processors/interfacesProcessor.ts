import {IOut} from 'graphqldb-types';
import {getIndexArgs} from '../utils/getIndexArgs';
import {IProcessor} from '../types';
import {getModels} from '../selectors/getModels';
import {getTypescriptType} from '../selectors/getTypescriptType';
import {getRelationships} from '../selectors/getRelationships';
import {getSelectors} from '../selectors/getSelectors';
import {removeEmptyLines} from '../utils/removeEmptyLines';

export const interfacesProcessor = ({json, prev}: IProcessor): IOut => {
  const models = getModels(json);
  const relationships = getRelationships(json);
  const selectors = getSelectors(json);

  return {
    ...prev,
    ts: removeEmptyLines(
      Object.keys(models).reduce((prev, current) => {
        const model = models[current];
        return `${prev}
interface I${current} {
${Object.keys(model.fields)
  .filter((item) => {
    const field = model.fields[item];
    return (
      !field?.directives?.key &&
      !field?.directives?.hasMany &&
      !field?.directives?.belongsTo
    );
  })
  .map((item) => {
    const field = model.fields[item];
    const type = getTypescriptType(field.type);

    return `    ${item}${field.required ? '' : '?'}: ${type}${
      field.isArray ? '[]' : ''
    };`;
  })
  .join('\n')}
${Object.keys(relationships[current].fields)
  .map((item) => {
    const {type, isArray} = relationships[current].fields[item];
    const tsType = getTypescriptType(type);

    return `    ${item}: () => Promise<${tsType}${isArray ? '[]' : ''}>;`;
  })
  .join('\n')}
}

interface IUpdate${current} {
${Object.keys(model.fields)
  .filter((item) => {
    const field = model.fields[item];
    return (
      !field?.directives?.key &&
      !field?.directives?.hasMany &&
      !field?.directives?.belongsTo
    );
  })
  .map((item) => {
    const field = model.fields[item];
    const type = getTypescriptType(field.type);

    return `    ${item}${field.required ? '' : '?'}: ${type}${
      field.isArray ? '[]' : ''
    };`;
  })
  .join('\n')}
}

interface I${current}Selectors {
${Object.keys(model.fields)
  .filter((item) => {
    return selectors[current].fields.includes(item);
  })
  .map((item) => {
    const field = model.fields[item];
    const type = getTypescriptType(field.type);

    return `    ${item}${field.required ? '' : '?'}: ${type}${
      field.isArray ? '[]' : ''
    };`;
  })
  .join('\n')}
}
      
interface I${current}QuerySelectors {
    limit?: number;
    startKey?: string;
${Object.keys(model.fields)
  .filter((item) => {
    return selectors[current].fields.includes(item);
  })
  .map((item) => {
    const field = model.fields[item];
    const type = getTypescriptType(field.type);

    return `    ${item}?: ${type}${field.isArray ? '[]' : ''};`;
  })
  .join('\n')}
}

${(models[current].directives?.model?.indexes || [])
  .map((index) => {
    const args = getIndexArgs(models[current], index);

    return `interface I${current}${index.name}QuerySelectors {
    limit?: number;
    startKey?: string;
${Object.keys(model.fields)
  .filter((item) => {
    return args.includes(item);
  })
  .map((item) => {
    const field = model.fields[item];
    const type = getTypescriptType(field.type);

    return `    ${item}?: ${type}${field.isArray ? '[]' : ''};`;
  })
  .join('\n')}
}`;
  })
  .join(',\n')}
      
interface IPaginated${current} {
    items: I${current}[];
    lastKey: string | null;
    limit: number;
}
      
interface ICreate${current} {
${Object.keys(model.fields)
  .filter((item) => {
    const field = model.fields[item];
    const isUUID = model.fields[item].directives?.uuid;
    return (
      !field?.directives?.key &&
      !field?.directives?.hasMany &&
      !field?.directives?.belongsTo &&
      !isUUID
    );
  })
  .map((item) => {
    const field = model.fields[item];
    const type = getTypescriptType(field.type);

    return `    ${item}${field.required ? '' : '?'}: ${type}${
      field.isArray ? '[]' : ''
    };`;
  })
  .join('\n')}
}`;
      }, prev.ts || ''),
    ),
  };
};
