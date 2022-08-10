import {buildSchema} from 'graphql';
import {flatten} from './flatten';
import {generateTypescript} from './generateTypescript';
import {writeGeneratedScript} from './writeGeneratedScript';
import {getSelectors} from './getSelectors';
import {IOptions} from '../types';
import {customDirectives} from './customDirectives';
import {getModelSettings} from './getModelSettings';
import {getRelationships} from './getRelationships';
import {generateResolvers} from './generateResolvers';
import {generateSchema} from './generateSchema';
import {writeGeneratedSchema} from './writeGeneratedSchema';

export const getDb = (schemaString: string, options?: IOptions) => {
  const combinedSchema = `${customDirectives}
${schemaString}`;
  const schema = buildSchema(combinedSchema);
  const typeMap = schema.getTypeMap();

  const models = Object.keys(typeMap).reduce(
    (prev, current) => {
      const hasModelDirective = (
        typeMap[current]?.astNode?.directives || []
      ).some((directive) => directive.name.value === 'model');
      if (hasModelDirective) {
        return {
          ...prev,
          [current]: typeMap[current],
        };
      }

      return prev;
    },
    {} as {
      [key: string]: any;
    },
  );

  const modelSettings = getModelSettings(models, options);
  const flattened = flatten(models);
  const selectors = getSelectors(models);
  const relationships = getRelationships(models);
  const generated = generateTypescript(
    options,
    flattened,
    selectors,
    modelSettings,
    relationships,
  );
  const generatedResolvers = generateResolvers(options, flattened);
  const generatedSchema = generateSchema(
    combinedSchema,
    options,
    flattened,
    selectors,
  );

  writeGeneratedScript(`${generated}${generatedResolvers}`, options);

  if (options.generateApi) {
    writeGeneratedSchema(generatedSchema, options);
  }

  return generated;
};
