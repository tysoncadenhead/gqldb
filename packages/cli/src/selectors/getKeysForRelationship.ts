import {ISchemaJsonModel, ISchemaJsonRelationship, KeyType} from '../types';
import {parseKeyArgs} from '../utils/getKeyArgs';

interface IKeysForRelationship {
  [key: string]: string;
}

export const getKeysForRelationship = (
  relationship: ISchemaJsonRelationship,
  model: ISchemaJsonModel,
): IKeysForRelationship => {
  const modelPk = Object.keys(model.fields)
    .map((key) => model.fields[key])
    .find((field) => field.directives.key.type === KeyType.pk);
  const modelSk = Object.keys(model.fields)
    .map((key) => model.fields[key])
    .find((field) => field.directives.key.type === KeyType.sk);

  const pkArgs = parseKeyArgs(relationship.pk);
  const skArgs = parseKeyArgs(relationship.sk);
  const modelPkArgs = parseKeyArgs(modelPk.directives.key.key);
  const modelSkArgs = parseKeyArgs(modelSk.directives.key.key);
  const fields = [...new Set([...pkArgs, ...skArgs])];
  const modelFields = [...new Set([...modelPkArgs, ...modelSkArgs])];

  return modelFields.reduce((prev, _current, i) => {
    if (!fields[i]) {
      return prev;
    }
    if (!modelFields[i]) {
      return prev;
    }
    return {
      ...prev,
      [fields[i]]: modelFields[i],
    };
  }, {} as IKeysForRelationship);
};
