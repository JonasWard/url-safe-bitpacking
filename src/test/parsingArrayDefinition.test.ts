import { expect, test } from 'bun:test';

import {
  ncdt_0,
  oedt_0,
  eedt_0,
  exampleVersion,
  generalNestedContentDataType,
  oedt_1,
  arrayDataTypeTest,
  versionArrayDataTypeTest,
} from './arrayDefinition.example';

import {
  parseNestedContentDataTypeToDefinitionNestedArray,
  parseEnumEntryDataTypeToDefinitionNestedGenerationObject,
  parseOptionalEntryDataTypeToDefinitionNestedGenerationObject,
  parseVersionArrayDefinitionTypeToVersionDefinitionObject,
  isSingleLevelContentType,
  doubleLevelContentTypeIsEnumEntryDataType,
  doubleLevelContentTypeIsOptionalEntryDataType,
  singleLevelContentTypeIsDataEntry,
  singleLevelContentTypeIsNestedContentDataType,
  doubleLevelContentTypeIsArrayDefinitionType,
} from '../objectmap/versionArrayDefinitionToObjectDefintion';
import { DefinitionArrayObject } from '../types';
import { SingleLevelContentType } from '../types/arrayDefinitions';
import { nestedDataEntryArrayToObject } from '../objectmap/versionReading';

test('dataValidation', () => {
  expect(isSingleLevelContentType(generalNestedContentDataType[1])).toBe(true);
  expect(singleLevelContentTypeIsNestedContentDataType(generalNestedContentDataType[1] as unknown as SingleLevelContentType)).toBe(false);
  expect(singleLevelContentTypeIsDataEntry(generalNestedContentDataType[1] as unknown as SingleLevelContentType)).toBe(false);
  expect(doubleLevelContentTypeIsEnumEntryDataType(generalNestedContentDataType[1])).toBe(false);
  expect(doubleLevelContentTypeIsOptionalEntryDataType(generalNestedContentDataType[1])).toBe(false);
  expect(doubleLevelContentTypeIsArrayDefinitionType(generalNestedContentDataType[1])).toBe(false);

  expect(isSingleLevelContentType(ncdt_0[1])).toBe(true);
  expect(singleLevelContentTypeIsNestedContentDataType(ncdt_0[1] as unknown as SingleLevelContentType)).toBe(false);
  expect(singleLevelContentTypeIsDataEntry(ncdt_0[1] as unknown as SingleLevelContentType)).toBe(false);
  expect(doubleLevelContentTypeIsEnumEntryDataType(ncdt_0[1])).toBe(false);
  expect(doubleLevelContentTypeIsOptionalEntryDataType(ncdt_0[1])).toBe(false);
  expect(doubleLevelContentTypeIsArrayDefinitionType(ncdt_0[1])).toBe(false);

  expect(isSingleLevelContentType(oedt_0)).toBe(false);
  expect(singleLevelContentTypeIsNestedContentDataType(oedt_0 as unknown as SingleLevelContentType)).toBe(false);
  expect(singleLevelContentTypeIsDataEntry(oedt_0 as unknown as SingleLevelContentType)).toBe(false);
  expect(doubleLevelContentTypeIsEnumEntryDataType(oedt_0)).toBe(false);
  expect(doubleLevelContentTypeIsOptionalEntryDataType(oedt_0)).toBe(true);
  expect(doubleLevelContentTypeIsArrayDefinitionType(oedt_0)).toBe(false);

  expect(isSingleLevelContentType(oedt_1)).toBe(false);
  expect(singleLevelContentTypeIsNestedContentDataType(oedt_1 as unknown as SingleLevelContentType)).toBe(false);
  expect(singleLevelContentTypeIsDataEntry(oedt_1 as unknown as SingleLevelContentType)).toBe(false);
  expect(doubleLevelContentTypeIsEnumEntryDataType(oedt_1)).toBe(false);
  expect(doubleLevelContentTypeIsOptionalEntryDataType(oedt_1)).toBe(true);
  expect(doubleLevelContentTypeIsArrayDefinitionType(oedt_1)).toBe(false);

  expect(isSingleLevelContentType(arrayDataTypeTest)).toBe(false);
  expect(singleLevelContentTypeIsNestedContentDataType(arrayDataTypeTest as unknown as SingleLevelContentType)).toBe(false);
  expect(singleLevelContentTypeIsDataEntry(arrayDataTypeTest as unknown as SingleLevelContentType)).toBe(false);
  expect(doubleLevelContentTypeIsEnumEntryDataType(arrayDataTypeTest)).toBe(false);
  expect(doubleLevelContentTypeIsOptionalEntryDataType(arrayDataTypeTest)).toBe(false);
  expect(doubleLevelContentTypeIsArrayDefinitionType(arrayDataTypeTest)).toBe(true);
});

test('simple valid entries', () =>
  expect(
    (() => {
      JSON.stringify(parseNestedContentDataTypeToDefinitionNestedArray(ncdt_0), null, 2);
      return true;
    })()
  ).toBe(true));

test('simple optional entry type', () =>
  expect(
    (() => {
      JSON.stringify(parseOptionalEntryDataTypeToDefinitionNestedGenerationObject(oedt_0, 'something'), null, 2);
      return true;
    })()
  ).toBe(true));

test('simple enum entry type', () =>
  expect(
    (() => {
      JSON.stringify(parseEnumEntryDataTypeToDefinitionNestedGenerationObject(eedt_0, 'something'), null, 2);
      return true;
    })()
  ).toBe(true));

test('simple version array type', () =>
  expect(
    (() => {
      JSON.stringify(parseVersionArrayDefinitionTypeToVersionDefinitionObject(exampleVersion), null, 2);
      return true;
    })()
  ).toBe(true));

test('parse to array and then parse back', () =>
  expect(
    (() => {
      // console.log(
      JSON.stringify(nestedDataEntryArrayToObject(parseVersionArrayDefinitionTypeToVersionDefinitionObject(exampleVersion) as DefinitionArrayObject), null, 2);
      // );
      return true;
    })()
  ).toBe(true));

test('simple array entry type', () =>
  expect(
    (() => {
      JSON.stringify(parseVersionArrayDefinitionTypeToVersionDefinitionObject(versionArrayDataTypeTest), null, 2);
      return true;
    })()
  ).toBe(true));

test('simple array entry type', () =>
  expect(
    (() => {
      JSON.stringify(nestedDataEntryArrayToObject(parseVersionArrayDefinitionTypeToVersionDefinitionObject(versionArrayDataTypeTest)), null, 2);
      return true;
    })()
  ).toBe(true));
