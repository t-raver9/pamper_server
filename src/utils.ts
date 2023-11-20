export const stringToFloat = (str: string): number => {
  const num = parseFloat(str);

  if (isNaN(num)) {
    throw new Error(`Invalid number: ${str}`);
  }

  return num;
};
