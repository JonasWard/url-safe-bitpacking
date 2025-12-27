import { ObjectDataEntry } from '../types';
import {
  getContentBitsCountForNestedData,
  nestedDataBitstringParser,
  nestedDataStringifier
} from './parserNestedDataUtils';

export const rawParser = (objectData: ObjectDataEntry, bitString: string): [ObjectDataEntry, string] => {
  const [value, remainingBitstring] = nestedDataBitstringParser(bitString, objectData.descriptor);
  return [{ ...objectData, value }, remainingBitstring];
};

export const getContentBitsCountForValue = (objectValue: ObjectDataEntry['value']): number =>
  getContentBitsCountForNestedData(objectValue);

export const rawStringifier = (objectData: ObjectDataEntry): string => nestedDataStringifier(objectData.value);
