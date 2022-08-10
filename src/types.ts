export type IModels = any; // @todo

export interface FlattenedField {
  key: string;
  type: string;
  originalType: string;
  required: boolean;
}

export interface Flattened {
  [key: string]: FlattenedField;
}

interface IKey {
  type: string;
  key: string;
  value: string;
  fields: string[];
}

export interface ISelectors {
  [key: string]: {
    fields: string[];
    keys: IKey[];
  };
}

export interface IOptions {
  tableName?: string;
  generateApi?: boolean;
  outputScriptPath?: string;
  outputSchemaPath?: string;
}

export interface IModelSettings {
  [key: string]: {
    tableName: string;
  };
}

export interface IAdapterOptions {
  tableName: string;
  model: string;
  keys: IKey[];
}

interface IRelationship {
  type: string;
  tsType: string;
  key: string;
  pk: string;
  sk: string;
  objectType: string;
  keys: string[];
}

export interface IRelationships {
  [model: string]: {
    [field: string]: IRelationship;
  };
}
