import {Person, Address} from '../.gqldb';

export const cleanup = async () => {
  const personResults = await Person.query({});
  await Promise.all(
    personResults.items.map(async (person) => {
      try {
        await Person.delete({id: person.id});
      } catch (err) {}
    }),
  );

  const addressResults = await Address.query({});
  await Promise.all(
    addressResults.items.map(async (address) => {
      try {
        await Address.delete({id: address.id, personId: address.personId});
      } catch (err) {}
    }),
  );
};
