import {IOptions, IOut} from 'graphqldb-types';

export interface ISchemaJsonIndex {
  name: string;
  index: string;
  pk: string;
  sk: string;
}

interface ISchemaJsonModelDirectives {
  model?: {
    table?: string;
    indexes?: ISchemaJsonIndex[];
  };
}

export enum KeyType {
  pk = 'pk',
  sk = 'sk',
}

export interface ISchemaJsonRelationship {
  pk: string;
  sk: string;
}

interface ISchemaJsonFieldDirectives {
  key?: {
    key: string;
    type?: KeyType;
  };
  uuid?: {};
  belongsTo?: ISchemaJsonRelationship;
  hasMany?: ISchemaJsonRelationship;
  constraint?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    startsWith?: string;
    endsWith?: string;
    contains?: string;
    notContains?: string;
    pattern?: string;
  };
}

export interface ISchemaJsonField {
  type: string;
  isArray: boolean;
  required: boolean;
  directives: ISchemaJsonFieldDirectives;
}

export interface ISchemaJsonModel {
  directives: ISchemaJsonModelDirectives;
  fields: {
    [key: string]: ISchemaJsonField;
  };
}

export interface ISchemaJson {
  [type: string]: ISchemaJsonModel;
}

export interface IProcessor {
  json: ISchemaJson;
  options: IOptions;
  prev: IOut;
}
