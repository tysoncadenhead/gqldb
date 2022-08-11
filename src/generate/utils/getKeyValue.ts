export const getKeyValue = (keyName: string, directive: any) => {
  const keyArg = directive.arguments.find((arg) => arg.name.value === keyName);
  return keyArg.value.value;
};
