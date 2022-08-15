import {gql} from './utils/gql';

export const customDirectives = gql`
  input GQLDBIndex {
    name: String!
    index: String!
    pk: String!
    sk: String!
  }

  directive @model(table: String, indexes: [GQLDBIndex]) on OBJECT
  directive @pk(key: String!) on FIELD_DEFINITION
  directive @sk(key: String!) on FIELD_DEFINITION
  directive @key(key: String!) on FIELD_DEFINITION
  directive @belongsTo(pk: String!, sk: String!) on FIELD_DEFINITION
  directive @hasOne(pk: String!, sk: String!) on FIELD_DEFINITION
  directive @hasMany(pk: String!, sk: String!) on FIELD_DEFINITION
  directive @generated on FIELD_DEFINITION
  directive @constraint(
    minLength: Int
    maxLength: Int
    startsWith: String
    endsWith: String
    contains: String
    notContains: String
    pattern: String
    min: Int
    max: Int
  ) on FIELD_DEFINITION
`;
