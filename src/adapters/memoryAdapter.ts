import {AdapterInterface} from './adapterInterface';
import {IAdapterOptions} from '../types';
import Mustache from 'mustache';
import {generateDynamicFields, isMainKey, buildPartialKey} from './helpers';

const memory = {};

export const memoryAdapter: AdapterInterface = {
  create: async <A, B>(options: IAdapterOptions, input: A): Promise<B> => {
    const {record, recordWithKeys} = generateDynamicFields(options, input);
    memory[options.tableName] = memory[options.tableName] || [];
    memory[options.tableName].push(recordWithKeys);
    return record as any as B;
  },
  update: async <A, B>(options: IAdapterOptions, input: A): Promise<B> => {
    memory[options.tableName] = memory[options.tableName] || [];
    const index = memory[options.tableName].findIndex((record) => {
      return options.keys.filter(isMainKey).every((key) => {
        return record[key.key] === Mustache.render(key.value, input);
      });
    });

    if (index === -1) {
      throw new Error('Not found');
    }

    memory[options.tableName][index] = {
      ...memory[options.tableName][index],
      ...input,
    };

    return memory[options.tableName][index] as any as B;
  },
  delete: async <A, B>(options: IAdapterOptions, input: A): Promise<B> => {
    memory[options.tableName] = memory[options.tableName] || [];
    const index = memory[options.tableName].findIndex((record) => {
      return options.keys.filter(isMainKey).every((key) => {
        return record[key.key] === Mustache.render(key.value, input);
      });
    });

    if (index === -1) {
      throw new Error('Not found');
    }

    const record = memory[options.tableName][index];

    memory[options.tableName].splice(index);

    return record;
  },
  find: async <A, B>(options: IAdapterOptions, input: A): Promise<B> => {
    const records = memory[options.tableName] || [];
    const record = records.find((record) => {
      return options.keys.filter(isMainKey).every((key) => {
        return record[key.key] === Mustache.render(key.value, input);
      });
    });

    if (!record) {
      throw new Error(`Not found`);
    }

    return record as any as B;
  },
  query: async <A, B>(options: IAdapterOptions, input: A): Promise<B> => {
    const anyInput = input as any;
    const limit = anyInput?.limit ? anyInput?.limit : 100;
    const records = memory[options.tableName] || [];

    const filteredRecords = records
      .filter((record) => {
        return options.keys.filter(isMainKey).every((key) => {
          if (key.type === 'pk') {
            return record[key.key] === Mustache.render(key.value, input);
          }

          const searchKey = buildPartialKey(key, input);
          return record[key.key].includes(searchKey);
        });
      })
      .filter((_record, index) => {
        if (!anyInput.startKey) {
          return true;
        }
        const key = JSON.parse(anyInput.startKey).index;
        return index >= key;
      })
      .filter((_record, index) => {
        return index < limit;
      });

    return {
      items: filteredRecords,
      limit,
      lastKey: JSON.stringify({
        index: filteredRecords.length,
      }),
    } as any as B;
  },
  queryByIndex: async <A, B>(
    options: IAdapterOptions,
    indexName: string,
    input: A,
  ): Promise<B> => {
    const anyInput = input as any;
    const limit = anyInput?.limit ? anyInput?.limit : 100;
    const records = memory[options.tableName] || [];
    const index = options.indexes.find((index) => index.name === indexName);

    const filteredRecords = records
      .filter((record) => {
        return options.keys
          .filter((key) => {
            return index.sk === key.key || index.pk === key.key;
          })
          .every((key) => {
            if (index.pk === key.key) {
              return record[key.key] === Mustache.render(key.value, input);
            }

            const searchKey = buildPartialKey(key, input);

            return record[key.key].includes(searchKey);
          });
      })
      .filter((_record, index) => {
        if (!anyInput.startKey) {
          return true;
        }
        const key = JSON.parse(anyInput.startKey).index;
        return index >= key;
      })
      .filter((_record, index) => {
        return index < limit;
      });

    return {
      items: filteredRecords,
      limit,
      lastKey: JSON.stringify({
        index: filteredRecords.length,
      }),
    } as any as B;
  },
};
