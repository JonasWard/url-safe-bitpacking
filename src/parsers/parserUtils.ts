export const base64url = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/**
 * Method that returns the bits required for a given amount of numners for a specific base
 * @param count - `number` amount of numbers
 * @param base - `number` max value of the numbers
 */
export const getBitsForEnumArrayCountOfBase = (count: number, base: number): number =>
  Math.ceil(Math.log2(base) * count);

/**
 * Method to convert an array of numbers to a bit string
 * @param input - `number[]` the input array of numbers to convert to a bit string
 * @param fromBase - `number` that represents the base of the input numbers
 * @returns `string` that represents the bit string of the input numbers
 * @returns 0 | 1 bit string
 */
export const convertArbitraryBaseToBitString = (input: number[], fromBase: number): string => {
  if (input.length === 0) return '';
  const expectedOutputLength = getBitsForEnumArrayCountOfBase(input.length, fromBase);
  const fromBaseBigInt = BigInt(fromBase);

  let decimalValue = BigInt(0);
  for (let i = input.length - 1; i >= 0; i--) decimalValue = decimalValue * fromBaseBigInt + BigInt(input[i]);

  const s = decimalValue.toString(2).padStart(expectedOutputLength, '0');
  return s;
};

/**
 * Method to convert a bit string to an array of numbers of a specific base
 * @param input - `string` that represents the bit string to convert to an array of numbers
 * @param toBase - `number` that represents the base of the output numbers
 * @param expectedOutputLength - `number` that represents the expected length of the output array
 */
export const convertBitStringToArbitraryBase = (
  input: string,
  toBase: number,
  expectedOutputLength: number
): number[] => {
  let decimalValue = BigInt(`0b${input === '' ? '0' : input}`);
  const toBaseBigInt = BigInt(toBase);

  // Step 2: Convert to the target base
  const result: number[] = [];
  while (decimalValue > 0) {
    const remainder = decimalValue % toBaseBigInt;
    result.push(Number(remainder));
    decimalValue = decimalValue / toBaseBigInt;
  }

  if (expectedOutputLength !== undefined && result.length !== expectedOutputLength)
    for (let i = result.length; i < expectedOutputLength; i++) result.push(0);

  return result;
};

/**
 * Unused method to convert an array of numbers from an arbitrary base to an arbitrary base
 * @param input - `number[]` the input array of numbers to convert to a bit string
 * @param fromBase - `number` that represents the base of the input numbers
 * @param toBase - `number` that represents the base of the output numbers
 * @param expectedOutputLength - `number` | optional, should be given when you should find a specific amount of output numbers
 */
export const convertArbitraryBaseToArbitraryBase = (
  input: number[],
  fromBase: number,
  toBase: number,
  expectedOutputLength?: number
): number[] => {
  if (fromBase < 2 || fromBase > 64)
    throw new Error(`fromBase ${fromBase} is not supported. Supported bases are from 2 to 64`);
  if (toBase < 2 || toBase > 64)
    throw new Error(`fromBase ${toBase} is not supported. Supported bases are from 2 to 64`);

  expectedOutputLength =
    expectedOutputLength === undefined
      ? Math.ceil((Math.log2(fromBase) * input.length) / Math.log2(toBase))
      : expectedOutputLength;

  const fromBaseBigInt = BigInt(fromBase);
  const toBaseBigInt = BigInt(toBase);

  // Step 1: Convert input to decimal
  let decimalValue = BigInt(0);
  for (let i = input.length - 1; i >= 0; i--) decimalValue = decimalValue * fromBaseBigInt + BigInt(input[i]);

  // Step 2: Convert to the target base
  const result: number[] = [];
  while (decimalValue > 0) {
    const remainder = decimalValue % toBaseBigInt;
    result.push(Number(remainder));
    decimalValue = decimalValue / toBaseBigInt;
  }

  if (expectedOutputLength !== undefined && result.length !== expectedOutputLength)
    for (let i = result.length; i < expectedOutputLength; i++) result.push(0);

  return result;
};

/**
 * Method that convists a bitstring to a url safe base64 string
 * @param bits - `string` of 0 | 1
 * @returns `string` that represents the url safe base64 string
 */
export const parseBitsToBase64 = (bits: string): string => {
  // split the bits into 6 bit chunks
  const chunks = bits.match(/.{1,6}/g);
  // parse the chunks into numbers
  const numbers = chunks?.map((c) => Number.parseInt(c.padEnd(6, '0'), 2)) ?? [];
  // map the numbers to base64
  return numbers.map((n) => base64url.charAt(n)).join('');
};

/**
 * Method that convists a url safe base64 string to a bitstring
 * @param base64 - `string` that represents the url safe base64 string
 * @returns `string` of 0 | 1
 */
export const parseBase64ToBits = (base64: string): string => {
  // map the base64 characters to numbers
  const numbers = base64.split('').map((c) => base64url.indexOf(c));
  // parse the numbers into 6 bit chunks
  const chunks = numbers.map((n) => n.toString(2).padStart(6, '0'));
  // join the chunks
  return chunks.join('');
};

/**
 * Method that stringifies a raw positive int
 * @param value - `number`
 * @param bitCount - `number` amount of bits to consider
 * @returns `string` of 0 | 1
 */
export const rawIntStringifier = (value: number, bitCount: number): string => {
  if (Number.isInteger(value) === false) throw new Error('Value is not an integer');
  return value.toString(2).padStart(bitCount, '0');
};

/**
 * Method that parses a state bitstring into a raw positive int
 * @param stateString - `string` 0 | 1
 * @param bitCount - `number` amount of bits to consider
 * @returns number
 */
export const rawValueParser = (stateString: string, bitCount: number): number => {
  if (stateString.length < bitCount)
    throw new Error(`To few bits for this int bit string (${stateString.length} instead of ${bitCount})`);
  if (stateString.length > bitCount)
    throw new Error(`To many bits for this int bit string (${stateString.length} instead of ${bitCount})`);

  if (bitCount === 0) return 0;

  const parsed = parseInt(stateString, 2);
  if (isNaN(parsed)) throw new Error('Invalid int state string');
  return parsed;
};
