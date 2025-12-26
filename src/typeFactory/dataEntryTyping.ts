// this file contains methods that create a type file for a given VersionContentDefinition

import { DataType } from '../enums';
import { DataEntry } from '../types';

export const getDataEntryTypeString = (d: DataEntry): string => {
  switch (d.type) {
    case 'BOOLEAN':
      return `{ type: "BOOLEAN" }`;
    case 'VERSION':
      return `{ type: "VERSION", bits: ${d.bits} }`;
    case 'ENUM':
      return `{ type: "ENUM", max: ${d.max}, bits: ${d.bits} }`;
    case 'INT':
      return `{ type: "INT", min: ${d.min}, max: ${d.max}, bits: ${d.bits} }`;
    case 'FLOAT':
      return `{ type: "FLOAT", min: ${d.min}, max: ${d.max}, precision: ${d.precision}, significand: ${d.significand} }`;
    case 'ENUM_ARRAY':
      return `{ type: "ENUM_ARRAY", minCount: ${d.minCount}, maxCount: ${d.maxCount}, max: ${d.max}, value: ${d.value} }`;
    case 'OPTIONAL':
      return `{ type: "OPTIONAL", descriptor: ${d.descriptor
        .map((d) => (d ? getDataEntryTypeString(d) : 'null'))
        .join(', ')}, value: ${d.value ? getDataEntryTypeString(d.value) : 'null'} }`;
    case 'ENUM_OPTIONS':
      return `{ type: "ENUM_OPTIONS", descriptor: ${d.descriptor
        .map((d) => (d ? getDataEntryTypeString(d) : 'null'))
        .join(', ')}, value: ${d.value ? getDataEntryTypeString(d.value) : 'null'} }`;
    case 'ARRAY':
      return `{ type: "ARRAY", descriptor: ${getDataEntryTypeString(d.descriptor)}, value: ${d.value
        .map((v) => getDataEntryTypeString(v))
        .join(', ')} }`;
    case 'OBJECT':
      return `{ type: "OBJECT", descriptor: ${d.descriptor
        .map((d) => getDataEntryTypeString(d))
        .join(', ')}, value: ${d.value.map((v) => getDataEntryTypeString(v)).join(', ')} }`;
  }
};

const typeNameStringAddition: Record<DataType, string> = {
  VERSION: 'V',
  BOOLEAN: 'B',
  ENUM: 'E',
  INT: 'I',
  FLOAT: 'F',
  ENUM_ARRAY: 'A',
  OPTIONAL: 'Y', // Optional
  ENUM_OPTIONS: 'C', // Checks
  ARRAY: 'L', // List
  OBJECT: 'O'
};

const getDataValueType = (d: DataEntry): string =>
  d.type === 'BOOLEAN' ? 'boolean' : d.type === 'ENUM_ARRAY' ? 'number[]' : 'number';
const getAttributeName = (d: DataEntry): string => `["${d.name}"]`;

export const getStateDataContentType = (d: DataEntry): string => `${getAttributeName(d)}: ${getDataEntryTypeString(d)}`;
export const getStateValueContentType = (d: DataEntry): string => `${getAttributeName(d)}: ${getDataValueType(d)}`;

export const getSafeName = (name: string): string => {
  let localName = name.replaceAll(' ', '');
  return localName.charAt(0).toUpperCase() + localName.slice(1);
};

export const getDateEntryTypeNamedString = (d: DataEntry): string =>
  `export type ${typeNameStringAddition[d.type]}${getSafeName(d.name)} = ${getDataEntryTypeString(d)};`;
