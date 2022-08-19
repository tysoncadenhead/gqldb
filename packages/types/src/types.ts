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
  outputPath?: string;
  adapter?: string;
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

export interface IValidations {
  [model: string]: {
    [field: string]: {
      [constraint: string]: string;
    };
  };
}

export interface IOut {
  [key: string]: string;
}

export interface IProcessor {
  options: IOptions;
  flattened: Flattened;
  selectors: ISelectors;
  modelSettings: IModelSettings;
  relationships: IRelationships;
  objectTypes: Flattened;
  validations: IValidations;
  combinedSchema: string;
  prev?: IOut;
}

export interface IWriter {
  options: IOptions;
  out: IOut;
}
