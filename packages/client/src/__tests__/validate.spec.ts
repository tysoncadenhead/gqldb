import {validate} from '../validate';

describe('Validate', () => {
  describe('min', () => {
    it('Should accept the number to match the requirement', () => {
      const result = validate(
        {
          age: {
            min: 18,
          },
        },
        {
          age: 18,
        },
      );

      expect(result).toBe(true);
    });

    it('Should throw if the number is less than the requirement', () => {
      expect(() => {
        validate(
          {
            age: {
              min: 18,
            },
          },
          {
            age: 17,
          },
        );
      }).toThrow(`age must be 18 or more`);
    });
  });
  describe('max', () => {
    it('Should accept the number to match the requirement', () => {
      const result = validate(
        {
          age: {
            max: 100,
          },
        },
        {
          age: 100,
        },
      );

      expect(result).toBe(true);
    });

    it('Should throw if the number is more than than the requirement', () => {
      expect(() => {
        validate(
          {
            age: {
              max: 100,
            },
          },
          {
            max: 101,
          },
        );
      }).toThrow(`age must be 100 or less`);
    });
  });
  describe('min length', () => {
    it('Should accept a string of the required length', () => {
      const result = validate(
        {
          message: {
            minLength: 2,
          },
        },
        {
          message: 'Hi',
        },
      );

      expect(result).toBe(true);
    });

    it('Should throw if the string is less than the required length', () => {
      expect(() => {
        validate(
          {
            message: {
              minLength: 2,
            },
          },
          {
            message: 'H',
          },
        );
      }).toThrow(`message must be at least 2 characters long`);
    });
  });
  describe('max length', () => {
    it('Should accept a string of the required length', () => {
      const result = validate(
        {
          message: {
            maxLength: 2,
          },
        },
        {
          message: 'Hi',
        },
      );

      expect(result).toBe(true);
    });

    it('Should throw if the string is more that than the required length', () => {
      expect(() => {
        validate(
          {
            message: {
              maxLength: 2,
            },
          },
          {
            message: 'Hello',
          },
        );
      }).toThrow(`message must be no more than 2 characters long`);
    });
  });

  describe('startsWith', () => {
    it('Should accept a string if it starts with the required string', () => {
      const result = validate(
        {
          message: {
            startsWith: 'Hello',
          },
        },
        {
          message: 'Hello World',
        },
      );

      expect(result).toBe(true);
    });

    it('Should throw if the string does not start with the required string', () => {
      expect(() => {
        validate(
          {
            message: {
              startsWith: 'Hello',
            },
          },
          {
            message: 'Howdy World',
          },
        );
      }).toThrow(`message must start with Hello`);
    });
  });

  describe('endsWith', () => {
    it('Should accept a string if it ends with the required string', () => {
      const result = validate(
        {
          message: {
            endsWith: 'father',
          },
        },
        {
          message: 'I am your father',
        },
      );

      expect(result).toBe(true);
    });

    it('Should throw if the string does not end with the required string', () => {
      expect(() => {
        validate(
          {
            message: {
              endsWith: 'father',
            },
          },
          {
            message: 'I am your mother',
          },
        );
      }).toThrow(`message must end with father`);
    });
  });

  describe('contains', () => {
    it('Should accept a string if it contains the required string', () => {
      const result = validate(
        {
          message: {
            contains: 'your',
          },
        },
        {
          message: 'I am your father',
        },
      );

      expect(result).toBe(true);
    });

    it('Should throw if the string does not contain the required string', () => {
      expect(() => {
        validate(
          {
            message: {
              contains: 'your',
            },
          },
          {
            message: 'You are my father',
          },
        );
      }).toThrow(`message must contain your`);
    });
  });

  describe('notContains', () => {
    it('Should accept a string if it does not contain the required string', () => {
      const result = validate(
        {
          message: {
            notContains: 'my',
          },
        },
        {
          message: 'I am your father',
        },
      );

      expect(result).toBe(true);
    });

    it('Should throw if the string contains the required string', () => {
      expect(() => {
        validate(
          {
            message: {
              notContains: 'my',
            },
          },
          {
            message: 'You are my father',
          },
        );
      }).toThrow(`message must not contain my`);
    });
  });

  describe('pattern', () => {
    const emailPattern = '[^@]+@[-a-z.].[a-z.]{2,6}';
    it('Should accept a string if it matches a pattern', () => {
      const result = validate(
        {
          email: {
            pattern: emailPattern,
          },
        },
        {
          email: 'foo@bar.com',
        },
      );

      expect(result).toBe(true);
    });

    it('Should throw if the string contains the required string', () => {
      expect(() => {
        validate(
          {
            email: {
              pattern: emailPattern,
            },
          },
          {
            email: 'NOT AN EMAIL',
          },
        );
      }).toThrow(`email must match the pattern ${emailPattern}`);
    });
  });
});
