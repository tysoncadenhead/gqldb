import {gql} from '../gql';

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
`;
