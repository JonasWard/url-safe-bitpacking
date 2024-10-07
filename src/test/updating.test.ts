import { expect, test } from 'bun:test';
import { DataEntryFactory } from '../factory';
import { ParserForVersion, VersionArrayDefinitionType } from '../types';
import { parseVersionArrayDefinitionTypeToVersionDefinitionObject } from '../objectmap/versionArrayDefinitionToObjectDefintion';
import { updateDataEntry } from '../objectmap/versionUpdate';
import { nestedDataEntryArrayToObject, parseDownNestedDataDescription } from '../objectmap/versionReading';

// base object definitions
const versionObject: VersionArrayDefinitionType = [
  DataEntryFactory.createVersion(0, 4, 'version'),
  [
    'enumEntry',
    [
      2,
      [DataEntryFactory.createInt(0, -1, 1, 'integer1')],
      [DataEntryFactory.createInt(0, -2, 1, 'integer2')],
      [DataEntryFactory.createInt(0, -3, 1, 'integer3')],
    ],
  ],
];

// base object definitions
const versionObjectBis: VersionArrayDefinitionType = [
  DataEntryFactory.createVersion(0, 4, 'version'),
  [
    'enumEntry',
    [
      2,
      [DataEntryFactory.createInt(0, -1, 1, 'integer1')],
      [DataEntryFactory.createInt(0, -2, 1, 'integer2')],
      [DataEntryFactory.createInt(0, -3, 1, 'integer3')],
    ],
  ],
  [
    'enumEntryBis',
    [
      2,
      [DataEntryFactory.createInt(0, -4, 1, 'integer1')],
      [DataEntryFactory.createInt(0, -5, 1, 'integer2')],
      [DataEntryFactory.createInt(0, -6, 1, 'integer3')],
    ],
  ],
];

const parsedVersiobObject = parseVersionArrayDefinitionTypeToVersionDefinitionObject(versionObject);

const versionObjects: ParserForVersion[] = [{ objectGeneratorParameters: parsedVersiobObject }];

const nestedObject = nestedDataEntryArrayToObject(parsedVersiobObject);
const nestedArray = parseDownNestedDataDescription(nestedObject);

const updatedObject = updateDataEntry(
  nestedObject,
  {
    value: 1,
    type: 2,
    max: 2,
    bits: 2,
    name: 'enumEntry',
    index: -1,
    internalName: '__enumEntry',
  },
  versionObjects
);
const nestedArrayAfterUpdate = parseDownNestedDataDescription(updatedObject);

const parsedVersiobObjectBis = parseVersionArrayDefinitionTypeToVersionDefinitionObject(versionObjectBis);

const versionObjectsBis: ParserForVersion[] = [{ objectGeneratorParameters: parsedVersiobObjectBis }];

const nestedObjectBis = nestedDataEntryArrayToObject(parsedVersiobObjectBis);
const nestedArrayBis = parseDownNestedDataDescription(nestedObjectBis);

const updatedObjectBis = updateDataEntry(
  nestedObjectBis,
  {
    value: 1,
    type: 2,
    max: 2,
    bits: 2,
    name: 'enumEntryBis',
    index: -1,
    internalName: '__enumEntryBis',
  },
  versionObjectsBis
);
const nestedArrayBisAfterUpdate = parseDownNestedDataDescription(updatedObjectBis);

// checking whether the object is able to parse
test('initialising version object', () => {
  expect(JSON.stringify(parsedVersiobObject, null, 2)).toBe(
    `[
  {
    "value": 0,
    "type": 0,
    "bits": 4,
    "name": "version",
    "index": -1
  },
  [
    "enumEntry",
    {
      "value": 2,
      "type": 2,
      "max": 2,
      "bits": 2,
      "name": "enumEntry",
      "index": -1,
      "internalName": "__enumEntry"
    },
    null
  ]
]`
  );
});

// parsing to object
test('object to nestedObject', () => {
  expect(nestedObject).toEqual({
    version: {
      value: 0,
      type: 0,
      bits: 4,
      name: 'version',
      index: 0,
    },
    enumEntry: {
      enumEntry: {
        value: 2,
        type: 2,
        max: 2,
        bits: 2,
        name: 'enumEntry',
        index: 1,
        internalName: '__enumEntry',
      },
      integer3: {
        value: 0,
        type: 3,
        min: -3,
        max: 1,
        bits: 3,
        name: 'integer3',
        internalName: '__enumEntry_integer3',
        index: 2,
      },
    },
  });
});

// parsing to flatArray
test('object to flatArray', () => {
  expect(nestedArray).toEqual([
    {
      value: 0,
      type: 0,
      bits: 4,
      name: 'version',
      index: 0,
    },
    {
      value: 2,
      type: 2,
      max: 2,
      bits: 2,
      name: 'enumEntry',
      index: 1,
      internalName: '__enumEntry',
    },
    {
      value: 0,
      type: 3,
      min: -3,
      max: 1,
      bits: 3,
      name: 'integer3',
      internalName: '__enumEntry_integer3',
      index: 2,
    },
  ]);
});

// parsing to flatArray
test('object to flatArray', () => {
  expect(nestedArrayAfterUpdate).toEqual([
    {
      value: 0,
      type: 0,
      bits: 4,
      name: 'version',
      index: 0,
    },
    {
      value: 1,
      type: 2,
      max: 2,
      bits: 2,
      name: 'enumEntry',
      index: 1,
      internalName: '__enumEntry',
    },
    {
      value: 0,
      type: 3,
      min: -2,
      max: 1,
      bits: 2,
      name: 'integer2',
      internalName: '__enumEntry_integer2',
      index: 2,
    },
  ]);
});

// checking nested updated object
test('updatedObject', () => {
  expect(updatedObject).toEqual({
    version: {
      value: 0,
      type: 0,
      bits: 4,
      name: 'version',
      index: 0,
    },
    enumEntry: {
      enumEntry: {
        value: 1,
        type: 2,
        max: 2,
        bits: 2,
        name: 'enumEntry',
        index: 1,
        internalName: '__enumEntry',
      },
      integer2: {
        value: 0,
        type: 3,
        min: -2,
        max: 1,
        bits: 2,
        name: 'integer2',
        internalName: '__enumEntry_integer2',
        index: 2,
      },
    },
  });
});

// checking nested updated object
test('object to nestedObjectBis', () => {
  expect(nestedArrayAfterUpdate).toEqual([
    {
      value: 0,
      type: 0,
      bits: 4,
      name: 'version',
      index: 0,
    },
    {
      value: 1,
      type: 2,
      max: 2,
      bits: 2,
      name: 'enumEntry',
      index: 1,
      internalName: '__enumEntry',
    },
    {
      value: 0,
      type: 3,
      min: -2,
      max: 1,
      bits: 2,
      name: 'integer2',
      internalName: '__enumEntry_integer2',
      index: 2,
    },
  ]);
});

// checking whether the object is able to parse
test('initialising version object', () => {
  expect(JSON.stringify(parsedVersiobObjectBis, null, 2)).toBe(
    `[
  {
    "value": 0,
    "type": 0,
    "bits": 4,
    "name": "version",
    "index": -1
  },
  [
    "enumEntry",
    {
      "value": 2,
      "type": 2,
      "max": 2,
      "bits": 2,
      "name": "enumEntry",
      "index": -1,
      "internalName": "__enumEntry"
    },
    null
  ],
  [
    "enumEntryBis",
    {
      "value": 2,
      "type": 2,
      "max": 2,
      "bits": 2,
      "name": "enumEntryBis",
      "index": -1,
      "internalName": "__enumEntryBis"
    },
    null
  ]
]`
  );
});

// parsing down
test('object to nestedObjectBis', () => {
  expect(nestedObjectBis).toEqual({
    version: {
      value: 0,
      type: 0,
      bits: 4,
      name: 'version',
      index: 0,
    },
    enumEntry: {
      enumEntry: {
        value: 2,
        type: 2,
        max: 2,
        bits: 2,
        name: 'enumEntry',
        index: 1,
        internalName: '__enumEntry',
      },
      integer3: {
        value: 0,
        type: 3,
        min: -3,
        max: 1,
        bits: 3,
        name: 'integer3',
        internalName: '__enumEntry_integer3',
        index: 2,
      },
    },
    enumEntryBis: {
      enumEntryBis: {
        value: 2,
        type: 2,
        max: 2,
        bits: 2,
        name: 'enumEntryBis',
        index: 3,
        internalName: '__enumEntryBis',
      },
      integer3: {
        value: 0,
        type: 3,
        min: -6,
        max: 1,
        bits: 3,
        name: 'integer3',
        internalName: '__enumEntryBis_integer3',
        index: 4,
      },
    },
  });
});

// parsing to flatArray
test('object to flatArrayBis', () => {
  expect(nestedArrayBis).toEqual([
    {
      value: 0,
      type: 0,
      bits: 4,
      name: 'version',
      index: 0,
    },
    {
      value: 2,
      type: 2,
      max: 2,
      bits: 2,
      name: 'enumEntry',
      index: 1,
      internalName: '__enumEntry',
    },
    {
      value: 0,
      type: 3,
      min: -3,
      max: 1,
      bits: 3,
      name: 'integer3',
      internalName: '__enumEntry_integer3',
      index: 2,
    },
    {
      value: 2,
      type: 2,
      max: 2,
      bits: 2,
      name: 'enumEntryBis',
      index: 3,
      internalName: '__enumEntryBis',
    },
    {
      value: 0,
      type: 3,
      min: -6,
      max: 1,
      bits: 3,
      name: 'integer3',
      internalName: '__enumEntryBis_integer3',
      index: 4,
    },
  ]);
});

// parsing to flatArray
test('updatedObjectBis', () => {
  expect(updatedObjectBis).toEqual({
    version: {
      value: 0,
      type: 0,
      bits: 4,
      name: 'version',
      index: 0,
    },
    enumEntry: {
      enumEntry: {
        value: 2,
        type: 2,
        max: 2,
        bits: 2,
        name: 'enumEntry',
        index: 1,
        internalName: '__enumEntry',
      },
      integer3: {
        value: 0,
        type: 3,
        min: -3,
        max: 1,
        bits: 3,
        name: 'integer3',
        index: 2,
        internalName: '__enumEntry_integer3',
      },
    },
    enumEntryBis: {
      enumEntryBis: {
        value: 1,
        type: 2,
        max: 2,
        bits: 2,
        name: 'enumEntryBis',
        index: 3,
        internalName: '__enumEntryBis',
      },
      integer2: {
        value: 0,
        type: 3,
        min: -5,
        max: 1,
        bits: 3,
        name: 'integer2',
        index: 4,
        internalName: '__enumEntryBis_integer2',
      },
    },
  });
});

// parsing to flatArray
test('updateObjectBis DataArray', () => {
  expect(nestedArrayBisAfterUpdate).toEqual([
    {
      value: 0,
      type: 0,
      bits: 4,
      name: 'version',
      index: 0,
    },
    {
      value: 2,
      type: 2,
      max: 2,
      bits: 2,
      name: 'enumEntry',
      index: 1,
      internalName: '__enumEntry',
    },
    {
      value: 0,
      type: 3,
      min: -3,
      max: 1,
      bits: 3,
      name: 'integer3',
      index: 2,
      internalName: '__enumEntry_integer3',
    },
    {
      value: 1,
      type: 2,
      max: 2,
      bits: 2,
      name: 'enumEntryBis',
      index: 3,
      internalName: '__enumEntryBis',
    },
    {
      value: 0,
      type: 3,
      min: -5,
      max: 1,
      bits: 3,
      name: 'integer2',
      index: 4,
      internalName: '__enumEntryBis_integer2',
    },
  ]);
});
