import { expect, test } from 'bun:test';

import {
  base64url,
  convertArbitraryBaseToArbitraryBase,
  convertArbitraryBaseToBitString,
  convertBitStringToArbitraryBase,
  parseBase64ToBits,
  parseBitsToBase64
} from '../parsers/parsers';

const n0to9 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
const n0to9_binary = [
  1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0
];

test('convertArbitraryBaseToArbitraryBase test', () =>
  expect(convertArbitraryBaseToArbitraryBase(n0to9, 10, 2)).toMatchObject(n0to9_binary));

test('convert back test', () =>
  expect(convertArbitraryBaseToArbitraryBase(n0to9_binary, 2, 10, n0to9.length)).toMatchObject(n0to9));

test('convert types', () => {
  let computationCount = 0;
  for (let i = 1; i < 16; i++) {
    for (let fromBase = 2; fromBase <= 64; fromBase++) {
      for (let toBase = 2; toBase <= 64; toBase++) {
        computationCount++;
        const randomNumber = i; //Math.floor(Math.random() * 9) + 1;
        const randomNumebrArray = [...Array(randomNumber)].map(() => Math.floor(Math.random() * fromBase));
        const expectedOutputLength = Math.ceil((Math.log2(fromBase) * randomNumber) / Math.log2(toBase));

        const result = convertArbitraryBaseToArbitraryBase(randomNumebrArray, fromBase, toBase);
        const resultBack = convertArbitraryBaseToArbitraryBase(result, toBase, fromBase, randomNumber);

        parseBitsToBase64(result.join(''));
        parseBase64ToBits(parseBitsToBase64(result.join('')));

        const enumBitWidth = Math.ceil(Math.log2(fromBase));

        if (result.length !== expectedOutputLength)
          console.log(
            randomNumebrArray.length * enumBitWidth,
            resultBack.length * enumBitWidth,
            result.length,
            expectedOutputLength
          );

        expect(resultBack).toMatchObject(randomNumebrArray);
      }
    }
  }
});

test('convert types', () => {
  for (let i = 0; i < 100; i++) {
    const numberCount = 2400; // Math.floor(Math.random() * 9) + 1;
    const baseFrom = Math.floor(Math.random() * 62) + 2;
    const baseTo = 64; // Math.floor(Math.random() * 62) + 2;

    const numberArrayFrom = [...Array(numberCount)].map(() => Math.floor(Math.random() * baseFrom));

    let p = performance.now();

    // console.log('\n');
    // console.log('########################################################');
    // console.log('numberArrayFrom: ', numberArrayFrom.length);
    // console.log('bit footprint: ', numberArrayFrom.length * baseFrom);

    // p = performance.now();
    const result = convertArbitraryBaseToArbitraryBase(numberArrayFrom, baseFrom, baseTo);
    // console.log('convertArbitraryBaseToArbitraryBase to', performance.now() - p);

    // p = performance.now();
    const resultBack = convertArbitraryBaseToArbitraryBase(result, baseTo, baseFrom, numberCount);
    // console.log('convertArbitraryBaseToArbitraryBase back', performance.now() - p);

    const resultString = [...result]
      .reverse()
      .map((n) => base64url[n])
      .join('');

    // p = performance.now();
    const bitStringFrom = convertArbitraryBaseToBitString(numberArrayFrom, baseFrom);
    // console.log('convertArbitraryBaseToBitString', performance.now() - p);

    // p = performance.now();
    const numberArray = convertBitStringToArbitraryBase(bitStringFrom, baseFrom, numberCount);
    // console.log('convertBitStringToArbitraryBase', performance.now() - p);

    p = performance.now();
    const base64From = parseBitsToBase64(bitStringFrom);
    console.log('parseBitsToBase64', performance.now() - p);

    p = performance.now();
    const bitArrayFrom = parseBase64ToBits(resultString);
    console.log('parseBase64ToBits', performance.now() - p);

    const bitArrayOut: number[] = [];
    for (let i = 0; i < bitArrayFrom.length; i++) bitArrayOut.push(Number(bitArrayFrom[i]));

    const output64: number[] = [];
    for (let i = 0; i < base64From.length; i++) output64.push(base64url.indexOf(base64From[i]));

    // console.log(resultBack, numberArrayFrom, numberArray);

    expect(resultBack).toMatchObject(numberArrayFrom);
    expect(numberArray).toMatchObject(numberArrayFrom);
  }
});
