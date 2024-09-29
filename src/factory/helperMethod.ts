export const getBitsForIntegerNumber = (number: number, maxBits: number): number => {
  const bitCount = Math.ceil(Math.log2(number));
  if (bitCount > maxBits) throw new Error(`Cannot get ${maxBits} bits for a number with ${bitCount} bits`);
  return bitCount;
};
