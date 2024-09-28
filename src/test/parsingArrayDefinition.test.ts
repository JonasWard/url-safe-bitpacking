import { expect, test } from 'bun:test';

import {
  nestedContentDataType,
  validOptionalEntryType,
  validEnumEntryType,
  exampleVersion,
  lucernaeTurici,
  generalNestedContentDataType,
  anotherValidOptionalEntryType,
} from './arrayDefinition.example';

import {
  parseNestedContentDataTypeToDefinitionNestedArray,
  parseEnumEntryDataTypeToDefinitionNestedGenerationObject,
  parseOptionalEntryDataTypeToDefinitionNestedGenerationObject,
  parseVersionArrayDefinitionTypeToVersionDefinitionObject,
  isSingleLevelContentType,
  singleLevelContentTypeIsEnumEntryDataType,
  singleLevelContentTypeIsOptionalEntryDataType,
  singleLevelContentTypeIsDataEntry,
  singleLevelContentTypeIsNestedContentDataType,
} from '../objectmap/versionArrayDefinitionToObjectDefintion';
import { nestedDataEntryArrayToObject } from '../objectmap';
import { DefinitionArrayObject } from '../types';
import { SingleLevelContentType } from '../types/arrayDefinitions';

test('dataValidation', () => {
  expect(isSingleLevelContentType(generalNestedContentDataType[1])).toBe(true);
  expect(singleLevelContentTypeIsNestedContentDataType(generalNestedContentDataType[1] as unknown as SingleLevelContentType)).toBe(false);
  expect(singleLevelContentTypeIsDataEntry(generalNestedContentDataType[1] as unknown as SingleLevelContentType)).toBe(false);
  expect(singleLevelContentTypeIsEnumEntryDataType(generalNestedContentDataType[1])).toBe(false);
  expect(singleLevelContentTypeIsOptionalEntryDataType(generalNestedContentDataType[1])).toBe(false);
  expect(isSingleLevelContentType(nestedContentDataType[1])).toBe(true);
  expect(singleLevelContentTypeIsNestedContentDataType(nestedContentDataType[1] as unknown as SingleLevelContentType)).toBe(false);
  expect(singleLevelContentTypeIsDataEntry(nestedContentDataType[1] as unknown as SingleLevelContentType)).toBe(false);
  expect(singleLevelContentTypeIsEnumEntryDataType(nestedContentDataType[1])).toBe(false);
  expect(singleLevelContentTypeIsOptionalEntryDataType(nestedContentDataType[1])).toBe(false);
  expect(isSingleLevelContentType(validOptionalEntryType)).toBe(false);
  expect(singleLevelContentTypeIsNestedContentDataType(validOptionalEntryType as unknown as SingleLevelContentType)).toBe(false);
  expect(singleLevelContentTypeIsDataEntry(validOptionalEntryType as unknown as SingleLevelContentType)).toBe(false);
  expect(singleLevelContentTypeIsEnumEntryDataType(validOptionalEntryType)).toBe(false);
  expect(singleLevelContentTypeIsOptionalEntryDataType(validOptionalEntryType)).toBe(true);
  expect(isSingleLevelContentType(anotherValidOptionalEntryType)).toBe(false);
  expect(singleLevelContentTypeIsNestedContentDataType(anotherValidOptionalEntryType as unknown as SingleLevelContentType)).toBe(false);
  expect(singleLevelContentTypeIsDataEntry(anotherValidOptionalEntryType as unknown as SingleLevelContentType)).toBe(false);
  expect(singleLevelContentTypeIsEnumEntryDataType(anotherValidOptionalEntryType)).toBe(false);
  expect(singleLevelContentTypeIsOptionalEntryDataType(anotherValidOptionalEntryType)).toBe(true);
});

test('simple valid entries', () =>
  expect(
    (() => {
      JSON.stringify(parseNestedContentDataTypeToDefinitionNestedArray(nestedContentDataType, 0), null, 2);
      return true;
    })()
  ).toBe(true));

test('simple optional entry type', () =>
  expect(
    (() => {
      JSON.stringify(parseOptionalEntryDataTypeToDefinitionNestedGenerationObject(validOptionalEntryType, 'something', 0), null, 2);
      return true;
    })()
  ).toBe(true));

test('simple enum entry type', () =>
  expect(
    (() => {
      JSON.stringify(parseEnumEntryDataTypeToDefinitionNestedGenerationObject(validEnumEntryType, 'something', 0), null, 2);
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
      JSON.stringify(
        nestedDataEntryArrayToObject(parseVersionArrayDefinitionTypeToVersionDefinitionObject(exampleVersion) as DefinitionArrayObject, 0),
        null,
        2
      );
      // );
      return true;
    })()
  ).toBe(true));

test('parse to object - lucernae turici', () =>
  expect(
    (() => {
      console.log(JSON.stringify(parseVersionArrayDefinitionTypeToVersionDefinitionObject(lucernaeTurici), null, 2));
      return true;
    })()
  ).toBe(true));

test('parse lucernae turici', () =>
  expect(
    (() => {
      console.log(
        JSON.stringify(
          nestedDataEntryArrayToObject(parseVersionArrayDefinitionTypeToVersionDefinitionObject(lucernaeTurici) as DefinitionArrayObject, 0),
          null,
          2
        )
      );
      return true;
    })()
  ).toBe(true));
