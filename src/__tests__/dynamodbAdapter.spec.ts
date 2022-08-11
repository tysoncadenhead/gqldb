import {setAdapter} from '..';
import {dynamodbAdapter} from '../adapters/dynamodbAdapter';
import {memoryAdapter} from '../adapters/memoryAdapter';
import {setup, OUTPUT_PATH} from '../testUtils/setup';

describe.skip('DynamoDB Adapter', () => {
  beforeAll(async () => {
    setAdapter(dynamodbAdapter);
    await setup();
  });

  afterAll(async () => {
    const {Person, Address} = await import(OUTPUT_PATH);

    const personResults = await Person.query({});
    await Promise.all(
      personResults.items.map(
        async (person) => await Person.delete({id: person.id}),
      ),
    );

    const addressResults = await Address.query({});
    await Promise.all(
      addressResults.items.map(
        async (address) =>
          await Address.delete({id: address.id, personId: address.personId}),
      ),
    );

    setAdapter(memoryAdapter);
  });

  it('Should create', async () => {
    const {Person} = await import(OUTPUT_PATH);

    const person = await Person.create({
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(person.firstName).toBe('John');
    expect(person.lastName).toBe('Doe');
  });

  it('Should find a record', async () => {
    const {Person} = await import(OUTPUT_PATH);

    const record = await Person.create({
      firstName: 'John',
      lastName: 'Doe',
    });

    const person = await Person.find({id: record.id});

    expect(person.firstName).toBe('John');
    expect(person.lastName).toBe('Doe');
  });

  it('Should update', async () => {
    const {Person} = await import(OUTPUT_PATH);

    const record = await Person.create({
      firstName: 'John',
      lastName: 'Doe',
    });

    const person = await Person.update({...record, firstName: 'Jane'});

    expect(person.firstName).toBe('Jane');
    expect(person.lastName).toBe('Doe');
  });

  it('Should delete', async () => {
    const {Person} = await import(OUTPUT_PATH);

    const record = await Person.create({
      firstName: 'John',
      lastName: 'Doe',
    });

    const person = await Person.delete({id: record.id});

    expect(person.firstName).toBe('John');
    expect(person.lastName).toBe('Doe');
  });

  it('Should query', async () => {
    const {Address} = await import(OUTPUT_PATH);

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
    const {Address} = await import(OUTPUT_PATH);

    await Address.create({
      personId: 'person1',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    });

    const addressResults = await Address.queryByState({state: 'CA', limit: 1});

    expect(addressResults.items.length).toBe(1);
  });
});
