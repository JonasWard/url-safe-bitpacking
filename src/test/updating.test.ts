import { expect, test } from 'bun:test';
import { DataEntryFactory } from '../factory';
import { VersionArrayDefinitionType } from '../types';
import { parseVersionArrayDefinitionTypeToVersionDefinitionObject } from '../objectmap/versionArrayDefinitionToObjectDefintion';

// base object definitions
const versionObject: VersionArrayDefinitionType = [
  DataEntryFactory.createVersion(0, 4, 'version'),
  [
    'enumEntry',
    [
      2,
      [DataEntryFactory.createInt(0, -1, 1, 'integer1')],
      [DataEntryFactory.createInt(0, -1, 1, 'integer2')],
      [DataEntryFactory.createInt(0, -1, 1, 'integer3')],
    ],
  ],
];

const parsedVersiobObject = parseVersionArrayDefinitionTypeToVersionDefinitionObject(versionObject);

// checking whether the object is able to parse
test('initialising version object', () =>
  expect(JSON.stringify(parsedVersiobObject, null, 2)).toBe(
    `[
  {
    "type": 0,
    "bits": 4,
    "value": 0,
    "name": "version",
    "index": 1
  },
  [
    "enumEntry",
    {
      "type": 2,
      "max": 2,
      "bits": 2,
      "value": 2,
      "name": "enumEntry_ENUM_TYPE",
      "index": 2
    },
    null
  ]
]`
  ));

// checking whether the object is able to parse
test('initialising version object', () =>
  expect(JSON.stringify(parsedVersiobObject, null, 2)).toBe(
    `[
  {
    "type": 0,
    "bits": 4,
    "value": 0,
    "name": "version",
    "index": 1
  },
  [
    "enumEntry",
    {
      "type": 2,
      "max": 2,
      "bits": 2,
      "value": 2,
      "name": "enumEntry_ENUM_TYPE",
      "index": 2
    },
    null
  ]
]`
  ));
