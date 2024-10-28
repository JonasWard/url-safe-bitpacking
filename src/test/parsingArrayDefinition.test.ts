import { expect, test } from 'bun:test';

import { ncdt_0, oedt_0, oedt_1, generalNestedContentDataType } from './arrayDefinition.example';
import { SingleLevelContentType } from '../types/arrayDefinitions';
import {
  doubleLevelContentTypeIsArrayDefinitionType,
  doubleLevelContentTypeIsEnumEntryDataType,
  doubleLevelContentTypeIsOptionalEntryDataType,
  isSingleLevelContentType,
  singleLevelContentTypeIsDataEntry,
  singleLevelContentTypeIsNestedContentDataType,
} from '../objectmap/stateValueHelperMethods';

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
});
