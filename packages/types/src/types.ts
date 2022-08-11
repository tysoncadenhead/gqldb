export type IModels = any; // @todo

export interface FlattenedField {
  key: string;
  type: string;
  originalType: string;
  required: boolean;
  isArray: boolean;
}

export interface Flattened {
  [key: string]: FlattenedField;
}

export interface IKey {
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

export interface IIndex {
  name: string;
  index: string;
  pk: string;
  sk: string;
}

export interface IModelSettings {
  [key: string]: {
    tableName: string;
    indexes: IIndex[];
  };
}

export interface IAdapterOptions {
  tableName: string;
  model: string;
  keys: IKey[];
  indexes: IIndex[];
}

interface IRelationship {
  type: string;
  tsType: string;
  key: string;
  pk: string;
  sk: string;
  objectType: string;
  keys: string[];
  isArray: boolean;
}

export interface IRelationships {
  [model: string]: {
    [field: string]: IRelationship;
  };
}
