import { DataType } from '@/enums';
import { EnumMappingType, EnumOptionsType, PrecisionRange, PrecisionRangeType } from '../types';

/**
 * Method to validate whether the bitscount work for a given state count and bitwidth
 */
const validateBitsCount = (stateCount: number, maxBitWidth: number, name: string, type: DataType): number => {
  const bitCountForStateCount = Math.ceil(Math.log2(stateCount));
  if (bitCountForStateCount > maxBitWidth)
    throw new Error(
      `Cannot store ${stateCount} state in ${maxBitWidth} bits for ${name} ${type} you would need ${bitCountForStateCount} bits`
    );
  return bitCountForStateCount;
};

/**
 * Method to validate the state of an unsigned int
 */
export const validateUnsignedInt = (
  min: number | undefined,
  max: number,
  defaultValue: number,
  name: string,
  type: DataType,
  maxBits: number
): { min: number; value: number; max: number; bitwidth: number } => {
  if (min === undefined || min < 0) min = 0;
  if (!Number.isInteger(min)) min = Math.floor(min); // rounding min to an integer
  if (!Number.isInteger(max)) max = Math.floor(max); // rounding max to an integer
  [min, max] = [min, max].sort((a, b) => a - b); // sorting min and max
  const bitwidth = validateBitsCount(max - min + 1, maxBits, name, type);
  if (!Number.isInteger(defaultValue)) defaultValue = Math.floor(defaultValue); // rounding defaultValue to an integer
  return { min, value: Math.max(min, Math.min(defaultValue, max)), max, bitwidth };
};

/**
 * Method to validate the state of a signed int
 */
export const validateSignedInt = (
  min: number,
  max: number,
  defaultValue: number,
  name: string,
  type: DataType,
  maxBits: number
): { min: number; value: number; max: number; bitwidth: number } => {
  if (!Number.isInteger(min)) min = Math.floor(min);
  if (!Number.isInteger(max)) max = Math.floor(max);
  if (!Number.isInteger(defaultValue)) defaultValue = Math.floor(defaultValue);
  [min, max] = [min, max].sort((a, b) => a - b); // sorting min and max
  const bitwidth = validateBitsCount(max - min + 1, maxBits, name, type);
  return { min, value: Math.max(min, Math.min(Math.round(defaultValue), max)), max, bitwidth };
};

/**
 * Method to validate FLOAT
 */
export const validateFloat = (
  min: number,
  max: number,
  defaultValue: number,
  precision: PrecisionRangeType,
  name: string,
  type: DataType,
  maxBits: number
): { min: number; value: number; max: number; bitwidth: number } => {
  if (!PrecisionRange.includes(precision)) throw new Error(`Precision ${precision} is not valid for ${name} ${type}`);
  const precisionMultiplier = 10 ** precision;
  min = Math.floor(min * precisionMultiplier);
  max = Math.floor(max * precisionMultiplier);
  [min, max] = [min, max].sort((a, b) => a - b); // sorting min and max
  const bitwidth = validateBitsCount(max - min + 1, maxBits, name, type);
  [min, max] = [min, max].map((v) => v / precisionMultiplier);
  const value = Math.max(min, Math.min(Math.round(defaultValue * precisionMultiplier) / precisionMultiplier, max));
  return { min, value, max, bitwidth };
};

/**
 * Method to get the max and mapping from the options
 * @param options - `any[] | string | number` the options to get the max and mapping from
 * @returns `{ max: number; mapping: any[] }` the max and mapping
 */
export const getEnumMaxAndMappingFromOptions = (
  options: EnumOptionsType
): { max: number; mapping: EnumMappingType } => {
  if (typeof options === 'string') return { max: options.length - 1, mapping: options.split('') };
  if (typeof options === 'number') return { max: options, mapping: Array.from({ length: options + 1 }, (_, i) => i) };
  return { max: options.length - 1, mapping: options };
};

/**
 * Method to get the options from the max and mapping of an ENUM & ENUM_ARRAY type
 * @param v - `{ max: number; mapping: EnumMappingType }` the max and mapping to get the options from
 * @returns `EnumOptionsType` the options
 */
export const getOptionsFromMaxAndMapping = (v: { max: number; mapping: EnumMappingType }): EnumOptionsType => {
  if (v.mapping.every((option) => typeof option === 'string' && option.length === 1)) return v.mapping.join('');
  if (Array.from({ length: v.max + 1 }, (_, i) => i).every((option, i) => option === v.mapping[i])) return v.max;

  return v.mapping;
};
