import { expect, test } from 'bun:test';

import { DataEntryFactory } from '../factory/factory';
import { dataArrayStringifier, dataBitsArrayParser } from '../parsers/parsers';
import { getDataEntryTypeString, getDateEntryTypeNamedString, getStateDataContentType, getStateValueContentType } from '../typeFactory/dataEntryTyping';

const dataMap = [
  DataEntryFactory.createVersion(3, 4, 'versionA', 0),
  DataEntryFactory.createVersion(7, 4, 'versionB', 1),
  DataEntryFactory.createVersion(9, 4, 'versionC', 2),
  DataEntryFactory.createInt(0, 0, 10, 'intA', 3),
  DataEntryFactory.createInt(3, 0, 10, 'intB', 4),
  DataEntryFactory.createInt(7, 0, 10, 'intC', 5),
  DataEntryFactory.createFloat(0.1, 0, 10, 1, 'floatA', 3),
  DataEntryFactory.createFloat(0.06, 0, 10, 2, 'floatB', 4),
  DataEntryFactory.createFloat(0.024, 0, 10, 3, 'floatC', 5),
  DataEntryFactory.createBoolean(true, 'boolA', 6),
  DataEntryFactory.createBoolean(false, 'boolB', 7),
  DataEntryFactory.createEnumArray([0, 1, 2], 0, 10, 3, 5, 'enumArrayA', 8)
];

const testStrings_user = [
  '{ value: number, name: "versionA", type: DataType.VERSION, bits: 4 }',
  '{ value: number, name: "versionB", type: DataType.VERSION, bits: 4 }',
  '{ value: number, name: "versionC", type: DataType.VERSION, bits: 4 }',
  '{ value: number, name: "intA", type: DataType.INT, min: 0, max: 10, bits: 4 }',
  '{ value: number, name: "intB", type: DataType.INT, min: 0, max: 10, bits: 4 }',
  '{ value: number, name: "intC", type: DataType.INT, min: 0, max: 10, bits: 4 }',
  '{ value: number, name: "floatA", type: DataType.FLOAT, min: 0, max: 10, precision: 1, significand: 7 }',
  '{ value: number, name: "floatB", type: DataType.FLOAT, min: 0, max: 10, precision: 2, significand: 10 }',
  '{ value: number, name: "floatC", type: DataType.FLOAT, min: 0, max: 10, precision: 3, significand: 14 }',
  '{ value: boolean, name: "boolA", type: DataType.BOOLEAN }',
  '{ value: boolean, name: "boolB", type: DataType.BOOLEAN }',
];

const testStrings_internalData = [
  '{ value: number, name: "versionA", type: DataType.VERSION, bits: 4 ,internalName: undefined, index: 0 }',
  '{ value: number, name: "versionB", type: DataType.VERSION, bits: 4 ,internalName: undefined, index: 1 }',
  '{ value: number, name: "versionC", type: DataType.VERSION, bits: 4 ,internalName: undefined, index: 2 }',
  '{ value: number, name: "intA", type: DataType.INT, min: 0, max: 10, bits: 4 ,internalName: undefined, index: 3 }',
  '{ value: number, name: "intB", type: DataType.INT, min: 0, max: 10, bits: 4 ,internalName: undefined, index: 4 }',
  '{ value: number, name: "intC", type: DataType.INT, min: 0, max: 10, bits: 4 ,internalName: undefined, index: 5 }',
  '{ value: number, name: "floatA", type: DataType.FLOAT, min: 0, max: 10, precision: 1, significand: 7 ,internalName: undefined, index: 3 }',
  '{ value: number, name: "floatB", type: DataType.FLOAT, min: 0, max: 10, precision: 2, significand: 10 ,internalName: undefined, index: 4 }',
  '{ value: number, name: "floatC", type: DataType.FLOAT, min: 0, max: 10, precision: 3, significand: 14 ,internalName: undefined, index: 5 }',
  '{ value: boolean, name: "boolA", type: DataType.BOOLEAN ,internalName: undefined, index: 6 }',
  '{ value: boolean, name: "boolB", type: DataType.BOOLEAN ,internalName: undefined, index: 7 }',
];

const testStrings_definedType = [
  'export type VVersionA = { value: number, name: "versionA", type: DataType.VERSION, bits: 4 ,internalName: undefined, index: 0 };',
  'export type VVersionB = { value: number, name: "versionB", type: DataType.VERSION, bits: 4 ,internalName: undefined, index: 1 };',
  'export type VVersionC = { value: number, name: "versionC", type: DataType.VERSION, bits: 4 ,internalName: undefined, index: 2 };',
  'export type IIntA = { value: number, name: "intA", type: DataType.INT, min: 0, max: 10, bits: 4 ,internalName: undefined, index: 3 };',
  'export type IIntB = { value: number, name: "intB", type: DataType.INT, min: 0, max: 10, bits: 4 ,internalName: undefined, index: 4 };',
  'export type IIntC = { value: number, name: "intC", type: DataType.INT, min: 0, max: 10, bits: 4 ,internalName: undefined, index: 5 };',
  'export type FFloatA = { value: number, name: "floatA", type: DataType.FLOAT, min: 0, max: 10, precision: 1, significand: 7 ,internalName: undefined, index: 3 };',
  'export type FFloatB = { value: number, name: "floatB", type: DataType.FLOAT, min: 0, max: 10, precision: 2, significand: 10 ,internalName: undefined, index: 4 };',
  'export type FFloatC = { value: number, name: "floatC", type: DataType.FLOAT, min: 0, max: 10, precision: 3, significand: 14 ,internalName: undefined, index: 5 };',
  'export type BBoolA = { value: boolean, name: "boolA", type: DataType.BOOLEAN ,internalName: undefined, index: 6 };',
  'export type BBoolB = { value: boolean, name: "boolB", type: DataType.BOOLEAN ,internalName: undefined, index: 7 };',
];

const testString_stateDataType = [
  '["versionA"]: { value: number, name: "versionA", type: DataType.VERSION, bits: 4 }',
  '["versionB"]: { value: number, name: "versionB", type: DataType.VERSION, bits: 4 }',
  '["versionC"]: { value: number, name: "versionC", type: DataType.VERSION, bits: 4 }',
  '["intA"]: { value: number, name: "intA", type: DataType.INT, min: 0, max: 10, bits: 4 }',
  '["intB"]: { value: number, name: "intB", type: DataType.INT, min: 0, max: 10, bits: 4 }',
  '["intC"]: { value: number, name: "intC", type: DataType.INT, min: 0, max: 10, bits: 4 }',
  '["floatA"]: { value: number, name: "floatA", type: DataType.FLOAT, min: 0, max: 10, precision: 1, significand: 7 }',
  '["floatB"]: { value: number, name: "floatB", type: DataType.FLOAT, min: 0, max: 10, precision: 2, significand: 10 }',
  '["floatC"]: { value: number, name: "floatC", type: DataType.FLOAT, min: 0, max: 10, precision: 3, significand: 14 }',
  '["boolA"]: { value: boolean, name: "boolA", type: DataType.BOOLEAN }',
  '["boolB"]: { value: boolean, name: "boolB", type: DataType.BOOLEAN }',
];

const testString_stateValueType = [
  '["versionA"]: number',
  '["versionB"]: number',
  '["versionC"]: number',
  '["intA"]: number',
  '["intB"]: number',
  '["intC"]: number',
  '["floatA"]: number',
  '["floatB"]: number',
  '["floatC"]: number',
  '["boolA"]: boolean',
  '["boolB"]: boolean',
];

test('simple data array parsing', () => {
  const bitstring = dataArrayStringifier(dataMap);
  const unpacked = dataBitsArrayParser(bitstring, dataMap);
  unpacked.forEach((data, index) => expect(dataMap[index].value).toBe(data.value));
});

test.only('content type test', async () =>
  dataMap.forEach((s, i) => expect(getDataEntryTypeString(s)).toEqual(testStrings_user[i])));
test.only('content type with internal data test', async () =>
  dataMap.map((s, i) => expect(getDataEntryTypeString(s, true)).toEqual(testStrings_internalData[i])));
test.only('content type named test', async () =>
  dataMap.map((s, i) => expect(getDateEntryTypeNamedString(s, true)).toEqual(testStrings_definedType[i])));
test.only('content StateData attribute type test', async () =>
  dataMap.map((s, i) => expect(getStateDataContentType(s)).toEqual(testString_stateDataType[i])));
test.only('content StateValue attribute type test', async () =>
  dataMap.map((s, i) => expect(getStateValueContentType(s)).toEqual(testString_stateValueType[i])));
