import {buildSchema, printSchema} from 'graphql';
import {flatten} from './flatten';
import {
  generateTypescript,
  generateSchema,
  generateResolvers,
} from './generate';
import {writeGeneratedScript} from './writers/writeGeneratedScript';
import {getSelectors} from './getSelectors';
import {IOptions} from '@graphqldb/types';
import {customDirectives} from './customDirectives';
import {getModelSettings} from './getModelSettings';
import {getRelationships} from './getRelationships';
import {writeGeneratedSchema} from './writers/writeGeneratedSchema';
import {getModels, getObjectTypes} from './transformers';
import {getValidations} from './getValidations';

export const generate = async (schemaString: string, options?: IOptions) => {
  const combinedSchema = `${customDirectives}
${schemaString}`;
  const schema = buildSchema(combinedSchema);

  const objectTypes = getObjectTypes(schema);
  const models = getModels(schema);

  const modelSettings = getModelSettings(models, options);
  const flattened = flatten(models);
  const selectors = getSelectors(models);
  const relationships = getRelationships(models);
  const flattenedObjectTypes = flatten(objectTypes);
  const validations = getValidations(models);
  const generated = generateTypescript(
    options,
    flattened,
    selectors,
    modelSettings,
    relationships,
    flattenedObjectTypes,
    validations,
  );
  const generatedResolvers = generateResolvers(
    options,
    flattened,
    selectors,
    relationships,
    modelSettings,
  );
  const generatedSchema = generateSchema(
    combinedSchema,
    options,
    flattened,
    selectors,
    modelSettings,
    flattenedObjectTypes,
  );

  writeGeneratedScript(
    `${generated}${generatedResolvers}`
      .replace(/'/g, '"')
      .replace(/\n\n*/g, '\r\n'),
    options,
  );

  if (options.generateApi) {
    writeGeneratedSchema(generatedSchema, options);
    writeGeneratedSchema(printSchema(buildSchema(generatedSchema)), options);
  }

  return generated;
};
