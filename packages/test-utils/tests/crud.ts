import {AdapterInterface} from '@graphqldb/adapter';
import {setAdapter} from '@graphqldb/client';
import {Person, Address} from '../.gqldb';
import {cleanup} from './cleanup';

export const crud = (adapterName: string, adapterType: AdapterInterface) =>
  describe(`${adapterName} Adapter CRUD`, () => {
    beforeAll(async () => {
      setAdapter(adapterType);
    });

    afterAll(cleanup);

    it('Should create', async () => {
      const person = await Person.create({
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(person.firstName).toBe('John');
      expect(person.lastName).toBe('Doe');
    });

    it('Should find a record', async () => {
      const record = await Person.create({
        firstName: 'John',
        lastName: 'Doe',
      });

      const person = await Person.find({id: record.id});

      expect(person.firstName).toBe('John');
      expect(person.lastName).toBe('Doe');
    });

    it('Should update', async () => {
      const record = await Person.create({
        firstName: 'John',
        lastName: 'Doe',
      });

      const person = await Person.update({...record, firstName: 'Jane'});

      expect(person.firstName).toBe('Jane');
      expect(person.lastName).toBe('Doe');
    });

    it('Should delete', async () => {
      const record = await Person.create({
        firstName: 'John',
        lastName: 'Doe',
      });

      const person = await Person.delete({id: record.id});

      expect(person.firstName).toBe('John');
      expect(person.lastName).toBe('Doe');
    });

    it('Should query', async () => {
      await Address.create({
        personId: 'person1',
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
      });

      const addressResults = await Address.query({personId: 'person1'});

      expect(addressResults.items.length).toBe(1);

      await Address.create({
        personId: 'person1',
        street: '222 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
      });

      const addressResults2 = await Address.query({
        personId: 'person1',
        limit: 1,
        startKey: addressResults.lastKey,
      });

      expect(addressResults2.items.length).toBe(1);
    });

    it('Should query by an index', async () => {
      await Address.create({
        personId: 'person1',
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
      });

      const addressResults = await Address.queryByState({
        state: 'CA',
        limit: 1,
      });

      expect(addressResults.items.length).toBe(1);
    });
  });
