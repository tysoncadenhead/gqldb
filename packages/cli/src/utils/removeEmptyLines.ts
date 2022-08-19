export const removeEmptyLines = (str: string): string =>
  str.replace(/^\s*[\r\n]/gm, '');
