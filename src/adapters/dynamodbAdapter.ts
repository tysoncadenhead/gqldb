import {AdapterInterface} from './adapterInterface';
import {IAdapterOptions} from '../types';
import Mustache from 'mustache';
import {DynamoDB} from 'aws-sdk';
import {generateDynamicFields} from './helpers';

const dynamodb = new DynamoDB();

export const dynamodbAdapter: AdapterInterface = {
  create: async <A, B>(options: IAdapterOptions, input: A): Promise<B> => {
    const {record, recordWithKeys} = generateDynamicFields(options, input);

    await dynamodb
      .putItem({
        Item: DynamoDB.Converter.marshall(recordWithKeys),
        TableName: options.tableName,
      })
      .promise();

    return record as any as B;
  },
  update: async <A, B>(options: IAdapterOptions, input: A): Promise<B> => {
    const record = await dynamodb
      .getItem({
        Key: DynamoDB.Converter.marshall(
          options.keys.reduce((prev, current) => {
            return {
              ...prev,
              [current.key]: Mustache.render(current.value, input),
            };
          }, {}),
        ),
        TableName: options.tableName,
      })
      .promise();

    if (!record?.Item) {
      throw new Error(`Not found`);
    }

    const item = DynamoDB.Converter.unmarshall(record.Item);

    const merged = {
      ...item,
      ...input,
    };

    await dynamodb
      .putItem({
        Item: DynamoDB.Converter.marshall(merged),
        TableName: options.tableName,
      })
      .promise();

    return merged as any as B;
  },
  delete: async <A, B>(options: IAdapterOptions, input: A): Promise<B> => {
    const lookupKey = DynamoDB.Converter.marshall(
      options.keys.reduce((prev, current) => {
        return {
          ...prev,
          [current.key]: Mustache.render(current.value, input),
        };
      }, {}),
    );

    const record = await dynamodb
      .getItem({
        Key: lookupKey,
        TableName: options.tableName,
      })
      .promise();

    if (!record?.Item) {
      throw new Error(`Not found`);
    }

    const item = DynamoDB.Converter.unmarshall(record.Item);

    await dynamodb
      .deleteItem({
        Key: lookupKey,
        TableName: options.tableName,
      })
      .promise();

    return item as any as B;
  },
  find: async <A, B>(options: IAdapterOptions, input: A): Promise<B> => {
    const record = await dynamodb
      .getItem({
        Key: DynamoDB.Converter.marshall(
          options.keys.reduce((prev, current) => {
            return {
              ...prev,
              [current.key]: Mustache.render(current.value, input),
            };
          }, {}),
        ),
        TableName: options.tableName,
      })
      .promise();

    if (!record?.Item) {
      throw new Error(`Not found`);
    }

    return DynamoDB.Converter.unmarshall(record?.Item) as any as B;
  },
  query: async <A, B>(options: IAdapterOptions, input: A): Promise<B> => {
    const pk = options.keys.find((key) => key.type === 'pk');
    const sk = options.keys.find((key) => key.type === 'sk');
    const anyInput = input as any;
    const limit = anyInput?.limit ? anyInput?.limit : 100;

    const expressionAttributeValues = {
      [`:${pk.key}`]: {S: Mustache.render(pk.value, input)},
      [`:${sk.key}`]: {
        S: Mustache.render(sk.value, {
          ...Object.keys(sk.fields).reduce((prev, current) => {
            return {
              ...prev,
              [sk.fields[current]]: '__NULL__',
            };
          }, {}),
          ...input,
        }).split('__NULL__')[0],
      },
    };

    const result = await dynamodb
      .query({
        TableName: options.tableName,
        Limit: limit,
        KeyConditionExpression: `${pk.key} = :${pk.key} AND begins_with(${sk.key}, :${sk.key})`,
        ExpressionAttributeValues: expressionAttributeValues,
      })
      .promise();

    return {
      items: result.Items.map((record) =>
        DynamoDB.Converter.unmarshall(record),
      ),
      limit,
      lastKey: result.LastEvaluatedKey,
    } as any as B;
  },
};
