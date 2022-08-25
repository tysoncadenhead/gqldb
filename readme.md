# GraphQLDB

> A noSQL-first ORM and API generator from GraphQL types.

Why do APIs require so much boilerplate? If we know the types of our database schema, we can theoretically let those types flow all the way through an ORM and through an API. GraphQLDB is designed to remove the undifferentiated heavy lifting of making talking to your database. Create a schema, generate it and you've got a working API!

## Installation

```bash
npm install @graphqldb/cli @graphqldb/client --save-dev
```

or

```bash
yarn add @graphqldb/cli @graphqldb/client --dev
```

## Quick Start

If you've installed this package with yarn, just run: 

```bash
yarn gqldb
```

The first time you run the `gqldb` command in your directory, we will generate a bare-bones `gqldb.json` and `gqldb.graphql` file.

#### gqldb.json

```json
{
    "generateApi": true,
    "tableName": "my-gqldb-table",
    "adapter": "@graphqldb/adapter-memory"
}
```

#### gqldb.graphql

```graphql
type Person @model {
    pk: String! @key(key: "Person", type: "pk")
    sk: String! @key(key: "id:{{id}}", type: "sk")
    id: ID! @uuid
    firstName: String!
    lastName: String!
}
```

The GraphQL file is your database schema. We will use it to generate your ORM and APIs. Run `yarn gqldb` again and we will generate both if the "generateApi" option is set to true in your package.json.

## Relationships

#### hasMany

```graphql
type Car @model {
    pk: String! @key(key: "Car", type: "pk")
    sk: String! @key(key: "personId:{{personId}}|id:{{id}}", type: "sk")
    id: ID! @uuid
}

type Person @model {
    pk: String! @key(key: "Person", type: "pk")
    sk: String! @key(key: "id:{{id}}", type: "sk")
    id: ID! @uuid
    cars: [Car] @hasMany(pk: "Car", sk: "personId:{{id}}")
}
```

#### mapMany

```graphql
type Car @model {
    pk: String! @key(key: "Car", type: "pk")
    sk: String! @key(key: "id:{{id}}", type: "sk")
    id: ID! @uuid
}

type Person @model {
    pk: String! @key(key: "Person", type: "pk")
    sk: String! @key(key: "id:{{id}}", type: "sk")
    id: ID! @uuid
    carIds: [ID!]!
    cars: [Car!]! @mapMany(map: "carIds", pk: "Car", sk: "id:{{_self}}")
}
```

#### belongsTo

```graphql
type Person @model {
    pk: String! @key(key: "Person", type: "pk")
    sk: String! @key(key: "id:{{id}}", type: "sk")
    id: ID! @uuid
}

type Car @model {
    pk: String! @key(key: "Car", type: "pk")
    sk: String! @key(key: "personId:{{personId}}|id:{{id}}", type: "sk")
    id: ID! @uuid
    ownerId: ID!
    owner: Person! @belongsTo(pk: "Person", sk: "id:{{ownerId}}")
}
```