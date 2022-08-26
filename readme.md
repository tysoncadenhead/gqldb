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
    "generateApi": true, # This is optional
    "tableName": "my-gqldb-table", # Your table name
    "adapter": "@graphqldb/adapter-memory" # We plan to support multiple adapters starting with memory and dynamodb
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

## Modeling Data

#### @model

Every graphqldb object must include an `@model` directive to signify that it is a separate independently retrievable object.

```graphql
type Person @model {
    id: ID! @uuid
    firstName: String!
    lastName: String!
}
```

For a single service, it's usually best practice to keep all of your data in a single table (defined in the gqldb.json), but you can override the table name on a per-model basis if needed:

```graphql
type Person @model(table: "my-table-name") {
    id: ID! @uuid
    firstName: String!
    lastName: String!
}
```

You may also define your indexes on the model:

```graphql
type Person @model(indexes: [
    {name: "ByState", index: "gsi1index", pk: "pk", sk: "gsi1"}
]) {
    id: ID! @uuid
    firstName: String!
    lastName: String!
}
```

#### @key

A key is a way to look up an object. This allows you to create a template for the data that will be pulled off the resolved object without having to do the heavy lifting to create the key shape every time. For example:

```graphql
@key(key: "id:{{id}}")
```

would get the `id` from the resolved object when a request is made for that object

Keys can also have a type specified. A `pk` type is the primary key, while an `sk` is the sort key. By default, there is no type specified, which is correct for a key used on a secondary index.

```graphql
type Person @model {
    pk: String! @key(key: "Person", type: "pk")
    sk: String! @key(key: "id:{{id}}", type: "sk")
    id: ID! @uuid
}
```

#### @uuid

This specifies an automatically generated UUID. Any UUID field will not be expected when creating an object, but will be used for updates, deletes and lookups.

```graphql
type Person @model {
    id: ID! @uuid
}
```

#### @hasMany

When the related object can be looked up using data from the current model, we can define a `hasMany` relationship. Both the `pk` and `fk` keys are templated so that you can add dynamic variables to them. The resolved object will pass itself in as an input to the templated keys.

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

#### @mapMany `Coming soon`

Maps over an array ( the `map` field ) in the current model and allows you to resolve the `pk` and `sk` keys with templated values from the current object. In addition to all the fields from the current object being available in the template, you may also use `{{_self}}` which is the current iteration of the mapped array.

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

#### @belongsTo

This defines a one-to-one relationship where the resolved response from the current object is passed into the templated `pk` and `sk` keys to look up the related model.

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

#### @constraint

Constraints are used for data validation. On create and update if the data does not match the constraints specified, an error will be thrown.

###### minLength

The input string must be at least the length specified.

```graphql
type Person @model {
    firstName: String! @constraint(minLength: 3)
}
```

###### maxLength

The input string must not be longer than the length specified.

```graphql
type Person @model {
    firstName: String! @constraint(minLength: 50)
}
```

###### startsWith

The input string must start with the specified string

```graphql
type Person @model {
    email: String! @constraint(startsWith: "hello")
}
```

###### endsWith

The input string must end with the specified string

```graphql
type Person @model {
    email: String! @constraint(endWith: ".com")
}
```

###### contains

The input string must contain the specified string

```graphql
type Person @model {
    email: String! @constraint(contains: "@")
}
```

###### notContains

The input string must not contain the specified string

```graphql
type Person @model {
    email: String! @constraint(notContains: "!")
}
```

###### min

The input number be at least the number supplied

```graphql
type Person @model {
    email: String! @constraint(min: 4)
}
```

###### max

The input number not be higher than the number supplied

```graphql
type Person @model {
    email: String! @constraint(max: 100)
}
```

###### pattern

The input string must match the regex pattern

```graphql
type Person @model {
    email: String! @constraint(pattern: "[^@]+@[-a-z.].[a-z.]{2,6}")
}
```

## Models

After compiling your schema using the `gqldb` command, there will be an `index.ts` file in the `.gqldb` directory that you can import into your project. There will be an export for each model name. For example, compiling this schema:

```graphql
type Person @model {
    pk: String! @key(key: "Person", type: "pk")
    sk: String! @key(key: "orgId:{{orgId}}|id:{{id}}", type: "sk")
    id: ID! @uuid
    orgId: ID!
    name: String!
}
```

will output an export named `Person` which will have the following methods:

#### find
**[Model].find(arguments: Record<string, any>)**

Returns a single record. Expects all `pk` and `sk` variables as input.

```ts
import { Person } from '../.gqldb';

const person = await Person.find({
    id: 'my-uuid',
    orgId: 'my-org-id'
});
```

#### create
**[Model].create(arguments: Record<string, any>)**

Creates a new record. Expects all required fields that are not annotated as `@key` or `@uuid`

```ts
import { Person } from '../.gqldb';

const person = await Person.create({
    name: 'Luke Skywalker',
    orgId: 'my-org-id'
});
```

#### update
**[Model].update(arguments: Record<string, any>)**

Updates a record. Expects all required fields that are not annotated as `@key`

```ts
import { Person } from '../.gqldb';

const person = await Person.update({
    id: 'my-uuid',
    orgId: 'my-org-id',
    name: 'Luke Skywalker'
});
```

#### delete
**[Model].delete(arguments: Record<string, any>)**

Deletes a record. Expects all `pk` and `sk` variables as input.

```ts
import { Person } from '../.gqldb';

const person = await Person.delete({
    id: 'my-uuid',
    orgId: 'my-org-id'
});
```

#### query
**[Model].query(arguments: Record<string, any>)**

Returns a list of paginated records with the following shape:

```json
{
    "items": [Record],
    "limit": Int,
    "lastKey": String | null
}
```

All `pk` an `sk` dynamic variables can be used as input in addition to:

```json
{
    "limit": Int,
    "startKey": String
}
```

The query will be run by overloading the `sk` key until there is a missing variable.

```ts
import { Person } from '../.gqldb';

const peopleResponse = await Person.query({
    limit: 10,
    orgId: 'my-org-id'
});

// First 10 users with the "my-org-id" orgId
const people = people.items;
```

#### query[IndexName]
**[Model].query[IndexName](arguments: Record<string, any>)**

For every index on the model, there will be a query by the index name.

For example, if we have an index called "ByName" defined like this:

```graphql
type Person @model(indexes: [
    {name: "ByName", index: "gsi1index", pk: "pk", sk: "gsi1"}
]) {
    pk: String! @key(key: "Person", type: "pk")
    sk: String! @key(key: "orgId:{{orgId}}|id:{{id}}", type: "sk")
    gsi1: String! @key(key: "firstName:{{firstName}}|lastName:{{lastName}}|id:{{id}}")
    id: ID! @uuid
    firstName: String!
    lastName: String!
}
```

We would get a `Person.queryByName()` method on generation.

This method returns a list of paginated records with the following shape:

```json
{
    "items": [Record],
    "limit": Int,
    "lastKey": String | null
}
```

All `pk` an `sk` dynamic variables can be used as input in addition to:

```json
{
    "limit": Int,
    "startKey": String
}
```

The query will be run by overloading the `sk` key until there is a missing variable.

```ts
import { Person } from '../.gqldb';

const peopleResponse = await Person.queryByName({
    limit: 10,
    firstName: 'Luke'
});

// First 10 users with the firstName of "Luke"
const people = people.items;
```

## GraphQL API

You can optionally set `generateApi` to `true` in your `gqldb.json` and get a full GraphQL API generated in addition to the ORM.

For example, given the following gqldb.graphql schema:

```graphql
type Person @model {
    pk: String! @key(key: "Person", type: "pk")
    sk: String! @key(key: "orgId:{{orgId}}|id:{{id}}", type: "sk")
    id: ID! @uuid
    orgId: ID!
    name: String!
}
```

Your schema will look something like this:

```graphql
type Person {
    id: ID!
    orgId: ID!
    name: String!
}

type PaginatedPerson {
  limit: Int!
  lastKey: String
  items: [Person!]!
}

input GetPersonInput {
  id: ID!
  organizationId: ID!
}

input QueryPersonRecordsInput {
  limit: Int
  startKey: String
  id: ID
  organizationId: ID
}

input CreatePersonInput {
    orgId: ID!
    name: String!
}

input UpdatePersonInput {
    id: ID!
    orgId: ID!
    name: String!
}

input DeletePersonInput {
  id: ID!
  organizationId: ID!
}

type Query {
    getPerson(input: GetPersonInput!): Person!
    queryPersonRecords(input: QueryPersonRecordsInput!): PaginatedPerson!
}

type Mutation {
    createPerson(input: CreatePersonInput!): Person!
    updatePerson(input: UpdatePersonInput!): Person!
    deletePerson(input: DeletePersonInput!): Person!
}
```

The schema and resolvers will be available as exports from the `.gqldb/index.ts` file and can be passed into any traditional typescript GraphQL server:

```typescript
import {ApolloServer} from 'apollo-server';
import { getResolvers, getTypeDefs } from '../.gqldb';

const resolvers = getResolvers();
const typeDefs = getTypeDefs();

const server = new ApolloServer({
    typeDefs,
    resolvers,
});
```

#### Handling Permissions

If you need to check that your authenticated user has access to a certain query or mutation, you can pass a `checkPermissions` function to your `getResolvers` method. This will pass in the expected permissions for each request along with the context for the request being performed:

```typescript
import { Permissions, getResolvers } from '../.gqldb';

const checkPermissions = (permission, ctx) => {
    // Check the user permissions that we added from our auth token in the ctx
    return !!ctx.permissions.includes(permission);
};

getResolvers({
    checkPermissions
});
```