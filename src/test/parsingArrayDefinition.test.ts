import { expect, test } from 'bun:test';

import { validDataEntryArray, validOptionalEntryType, validEnumEntryType, exampleVersion, lucernaeTurici } from './arrayDefinition.example';

import {
  parseValidEntriesToDefinitionNestedArray,
  parseEnumEntryDataTypeToDefinitionNestedGenerationObject,
  parseOptionalEntryDataTypeToDefinitionNestedGenerationObject,
  parseVersionArrayDefinitionTypeToVersionDefinitionObject,
} from '../objectmap/versionArrayDefinitionToObjectDefintion';
import { nestedDataEntryArrayToObject } from '../objectmap';
import { DefinitionArrayObject } from '../types';

test('simple valid entries', () =>
  expect(
    (() => {
      console.log(JSON.stringify(parseValidEntriesToDefinitionNestedArray(validDataEntryArray, 0), null, 2));
      return true;
    })()
  ).toBe(true));

test('simple optional entry type', () =>
  expect(
    (() => {
      console.log(JSON.stringify(parseOptionalEntryDataTypeToDefinitionNestedGenerationObject(validOptionalEntryType, 'something', 0), null, 2));
      return true;
    })()
  ).toBe(true));

test('simple enum entry type', () =>
  expect(
    (() => {
      console.log(JSON.stringify(parseEnumEntryDataTypeToDefinitionNestedGenerationObject(validEnumEntryType, 'something', 0), null, 2));
      return true;
    })()
  ).toBe(true));

test('simple version array type', () =>
  expect(
    (() => {
      console.log(JSON.stringify(parseVersionArrayDefinitionTypeToVersionDefinitionObject(exampleVersion), null, 2));
      return true;
    })()
  ).toBe(true));

test('parse to array and then parse back', () =>
  expect(
    (() => {
      console.log(
        JSON.stringify(
          nestedDataEntryArrayToObject(parseVersionArrayDefinitionTypeToVersionDefinitionObject(exampleVersion) as DefinitionArrayObject, 0),
          null,
          2
        )
      );
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
