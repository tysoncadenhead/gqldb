// THIS IS A GENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
import * as fs from "fs";
import * as path from "path";
import { getAdapter } from "@graphqldb/client";
interface IAddress {
  id: string;
  personId: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  person: () => Promise<IPerson>;
}
interface IUpdateAddress {
  id: string;
  personId: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}
interface IAddressSelectors {
  id: string;
  personId: string;
}
interface IAddressQuerySelectors {
  limit?: number;
  startKey?: string;
  id?: string;
  personId?: string;
}
interface IAddressByStateQuerySelectors {
  limit?: number;
  startKey?: string;
  id?: string;
  city?: string;
  state?: string;
}
interface IPaginatedAddress {
  items: IAddress[];
  lastKey: string | null;
  limit: number;
}
interface ICreateAddress {
  personId: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}
interface IPerson {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  addresses: () => Promise<IAddress[]>;
}
interface IUpdatePerson {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
}
interface IPersonSelectors {
  id: string;
}
interface IPersonQuerySelectors {
  limit?: number;
  startKey?: string;
  id?: string;
}
interface IPaginatedPerson {
  items: IPerson[];
  lastKey: string | null;
  limit: number;
}
interface ICreatePerson {
  firstName: string;
  lastName: string;
  age?: number;
}
const optionsForAddress = {
  model: "Address",
  tableName: "mindful-ex-tyson",
  indexes: [{"name":"ByState","index":"gsi1index","pk":"pk","sk":"gsi1"}],
  keys: [
  {
    "type": "pk",
    "key": "pk",
    "value": "Address",
    "fields": []
  },
  {
    "type": "sk",
    "key": "sk",
    "value": "personId:{{personId}}|id:{{id}}",
    "fields": [
      "personId",
      "id"
    ]
  },
  {
    "type": "key",
    "key": "gsi1",
    "value": "state:{{state}}|city:{{city}}|id:{{id}}",
    "fields": [
      "state",
      "city",
      "id"
    ]
  }
],
};
const relationshipsForAddress = (data: IAddress) => {
  return {
    ...data,
    person: async () => {
      return await Person.find({ id: data.personId,})
    },
  };
};
export const Address = {
  create: async (data: ICreateAddress) : Promise<IAddress> => {
    return relationshipsForAddress(await getAdapter().create<ICreateAddress, IAddress>(optionsForAddress, data));
  },
  update: async (data: IUpdateAddress) : Promise<IAddress> => {
    return relationshipsForAddress(await getAdapter().update<IUpdateAddress, IAddress>(optionsForAddress, data));
  },
  delete: async (data: IAddressSelectors) : Promise<IAddress> => {
    return relationshipsForAddress(await getAdapter().delete<IAddressSelectors, IAddress>(optionsForAddress, data));
  },
  find: async (data: IAddressSelectors) : Promise<IAddress> => {
    return relationshipsForAddress(await getAdapter().find<IAddressSelectors, IAddress>(optionsForAddress, data));
  },
  query: async (data: IAddressQuerySelectors) : Promise<IPaginatedAddress> => {
    const result = await getAdapter().query<IAddressQuerySelectors, IPaginatedAddress>(optionsForAddress, data);
    return {
      ...result,
      items: result.items.map(relationshipsForAddress),
    };
  },
  queryByState: async (data: IAddressByStateQuerySelectors) : Promise<IPaginatedAddress> => {
    const result = await getAdapter().queryByIndex<IAddressByStateQuerySelectors, IPaginatedAddress>(optionsForAddress, "ByState", data);
    return {
      ...result,
      items: result.items.map(relationshipsForAddress),
    };
  }
}
const optionsForPerson = {
  model: "Person",
  tableName: "mindful-ex-tyson",
  indexes: [],
  keys: [
  {
    "type": "pk",
    "key": "pk",
    "value": "Person",
    "fields": []
  },
  {
    "type": "sk",
    "key": "sk",
    "value": "id:{{id}}",
    "fields": [
      "id"
    ]
  }
],
};
const relationshipsForPerson = (data: IPerson) => {
  return {
    ...data,
    addresses: async () => {
      const result = await Address.query({ personId: data.id,});
      return result.items;
    },
  };
};
export const Person = {
  create: async (data: ICreatePerson) : Promise<IPerson> => {
    return relationshipsForPerson(await getAdapter().create<ICreatePerson, IPerson>(optionsForPerson, data));
  },
  update: async (data: IUpdatePerson) : Promise<IPerson> => {
    return relationshipsForPerson(await getAdapter().update<IUpdatePerson, IPerson>(optionsForPerson, data));
  },
  delete: async (data: IPersonSelectors) : Promise<IPerson> => {
    return relationshipsForPerson(await getAdapter().delete<IPersonSelectors, IPerson>(optionsForPerson, data));
  },
  find: async (data: IPersonSelectors) : Promise<IPerson> => {
    return relationshipsForPerson(await getAdapter().find<IPersonSelectors, IPerson>(optionsForPerson, data));
  },
  query: async (data: IPersonQuerySelectors) : Promise<IPaginatedPerson> => {
    const result = await getAdapter().query<IPersonQuerySelectors, IPaginatedPerson>(optionsForPerson, data);
    return {
      ...result,
      items: result.items.map(relationshipsForPerson),
    };
  },
}
const getArguments = <I> (a, b) : I => {
  return a?.context?.arguments?.input || b?.input;
};
export const getResolvers = () => ({
  Address: {
    person: async (ctx) => {
      return await Person.find({ id: ctx.personId,})
    },
  },
  Person: {
    addresses: async (ctx) => {
      const result = await Address.query({ personId: ctx.id,});
      return result.items;
    },
  },
  Query: {
    getAddress: async (a, b) => {
      const args = getArguments<IAddressSelectors>(a, b);
      return await Address.find(args);
    },
    queryAddressRecords: async (a, b) => {
      const args = getArguments<IAddressQuerySelectors>(a, b);
      return await Address.query(args);
    },
    queryAddressRecordsByState: async (a, b) => {
      const args = getArguments<IAddressByStateQuerySelectors>(a, b);
      return await Address.queryByState(args);
    },
    getPerson: async (a, b) => {
      const args = getArguments<IPersonSelectors>(a, b);
      return await Person.find(args);
    },
    queryPersonRecords: async (a, b) => {
      const args = getArguments<IPersonQuerySelectors>(a, b);
      return await Person.query(args);
    },
    
  },
  Mutation: {
    createAddress: async (a, b) => {
      const args = getArguments<ICreateAddress>(a, b);
      return await Address.create(args);
    },
    updateAddress: async (a, b) => {
      const args = getArguments<IUpdateAddress>(a, b);
      return await Address.update(args);
    },
    deleteAddress: async (a, b) => {
      const args = getArguments<IAddressSelectors>(a, b);
      return await Address.delete(args);
    },
    createPerson: async (a, b) => {
      const args = getArguments<ICreatePerson>(a, b);
      return await Person.create(args);
    },
    updatePerson: async (a, b) => {
      const args = getArguments<IUpdatePerson>(a, b);
      return await Person.update(args);
    },
    deletePerson: async (a, b) => {
      const args = getArguments<IPersonSelectors>(a, b);
      return await Person.delete(args);
    },
  },
});
export const getTypeDefs = () => fs.readFileSync(path.resolve(__dirname, "./schema.graphql"), "utf8");