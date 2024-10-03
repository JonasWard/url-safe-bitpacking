import { expect, test } from 'bun:test';
import { DataEntryFactory } from '../factory';
import { VersionArrayDefinitionType } from '../types';
import { parseVersionArrayDefinitionTypeToVersionDefinitionObject } from '../objectmap/versionArrayDefinitionToObjectDefintion';
import { nestedDataEntryArrayToObject } from '../objectmap';

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
test('initialising version object', () => {
  expect(JSON.stringify(parsedVersiobObject, null, 2)).toBe(
    `[
  {
    "value": 0,
    "type": 0,
    "bits": 4,
    "name": "version",
    "index": 1
  },
  [
    "enumEntry",
    {
      "value": 2,
      "type": 2,
      "max": 2,
      "bits": 2,
      "name": "enumEntry_ENUM_TYPE",
      "index": 2
    },
    null
  ]
]`
  );
});

// parsing down
test('object to data array', () => {
  const dataArray = nestedDataEntryArrayToObject(parsedVersiobObject, 0);

  expect(JSON.stringify(parsedVersiobObject, null, 2)).toBe(
    `[
  {
    "value": 0,
    "type": 0,
    "bits": 4,
    "name": "version",
    "index": 1
  },
  [
    "enumEntry",
    {
      "value": 2,
      "type": 2,
      "max": 2,
      "bits": 2,
      "name": "enumEntry_ENUM_TYPE",
      "index": 2
    },
    null
  ]
]`
  );
});

// checking whether the object is able to parse
test('initialising version object', () => {
  const dataArray = expect(JSON.stringify(parsedVersiobObject, null, 2)).toBe(
    `[
  {
    "value": 0,
    "type": 0,
    "bits": 4,
    "name": "version",
    "index": 1
  },
  [
    "enumEntry",
    {
      "value": 2,
      "type": 2,
      "max": 2,
      "bits": 2,
      "name": "enumEntry_ENUM_TYPE",
      "index": 2
    },
    null
  ]
]`
  );
});
