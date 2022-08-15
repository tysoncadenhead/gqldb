export const toCamelCase = (input: string): string => {
  const firstLetter = input.substring(0, 1).toLowerCase();
  const restLetters = input.substring(1);
  return firstLetter + restLetters;
};
