import {AdapterInterface} from 'graphqldb-adapter';
import {setAdapter} from 'graphqldb-client';
import {Person, Address} from '../.gqldb';
import {cleanup} from './cleanup';

export const relationships = (
  adapterName: string,
  adapterType: AdapterInterface,
) =>
  describe(`${adapterName} Adapter Relationships`, () => {
    beforeAll(async () => {
      setAdapter(adapterType);
    });

    afterAll(cleanup);

    it('Should create a parent child relationship', async () => {
      const person = await Person.create({
        firstName: 'John',
        lastName: 'Doe',
      });

      const address = await Address.create({
        personId: person.id,
        street: '222 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
      });

      const record = await address.person();

      expect(record.firstName).toBe('John');
      expect(record.lastName).toBe('Doe');
    });

    it('Should create a child parent relationship', async () => {
      const person = await Person.create({
        firstName: 'John',
        lastName: 'Doe',
      });

      await Address.create({
        personId: person.id,
        street: '222 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
      });

      const records = await person.addresses();

      expect(records[0].city).toBe('Anytown');
    });
  });
