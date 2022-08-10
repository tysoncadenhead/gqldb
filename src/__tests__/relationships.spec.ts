import {setAdapter} from '..';
import {memoryAdapter} from '../adapters/memoryAdapter';
import {setup, OUTPUT_PATH} from '../testUtils/setup';

describe.skip('Relationships', () => {
  beforeAll(() => {
    setAdapter(memoryAdapter);
    setup();
  });

  afterAll(() => {
    setAdapter(memoryAdapter);
  });

  it('Should create a parent child relationship', async () => {
    const {Person, Address} = await import(OUTPUT_PATH);

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
    const {Person, Address} = await import(OUTPUT_PATH);

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
