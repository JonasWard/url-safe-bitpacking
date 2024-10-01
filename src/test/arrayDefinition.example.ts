import { DataEntryFactory } from '../factory';
import { nestedDataEntryArrayToObject } from '../objectmap';
import { parseVersionArrayDefinitionTypeToVersionDefinitionObject } from '../objectmap/versionArrayDefinitionToObjectDefintion';
import { DefinitionArrayObject, ParserForVersion, VersionDefinitionObject } from '../types';
import {
  NestedContentDataType,
  OptionalEntryDataType,
  EnumEntryDataType,
  VersionArrayDefinitionType,
  SingleLevelContentType,
  NestedContentType,
} from '../types/arrayDefinitions';

export const nestedContentDataType: NestedContentDataType = ['a name', [DataEntryFactory.createFloat(0, 0, 1, 2, 'someFloat')]];

export const validOptionalEntryType: OptionalEntryDataType = [true, [DataEntryFactory.createFloat(0, 0, 1, 2, 'someFloat')], []];
export const anotherValidOptionalEntryType: OptionalEntryDataType = [true, [], [DataEntryFactory.createFloat(0, 0, 1, 2, 'someFloat')]];
// const invalidValidOptionalEntryType: OptionalEntryDataType = [[], [], [DataEntryFactory.createFloat(0, 0, 1, 2, 'someFloat')]];

export const validEnumEntryType: EnumEntryDataType = [
  1,
  [DataEntryFactory.createFloat(0, 0, 1, 2, 'someFloat')],
  [DataEntryFactory.createFloat(0, 0, 1, 2, 'someFloat')],
  [DataEntryFactory.createFloat(0, 0, 1, 2, 'someFloat')],
];

export const generalNestedContentDataType: NestedContentDataType = [
  'anotherEntry',
  [DataEntryFactory.createFloat(0, 0, 1, 2, 'someFloat'), DataEntryFactory.createBoolean(true, 'someBoolean')],
];

export const exampleVersion: VersionArrayDefinitionType = [
  DataEntryFactory.createVersion(0, 8, 'version'),
  ['someEntry', [DataEntryFactory.createFloat(0, 0, 1, 2, 'someFloat')]],
  ['anotherEntry', [DataEntryFactory.createFloat(0, 0, 1, 2, 'someFloat'), DataEntryFactory.createBoolean(true, 'someBoolean')]],
  ['enumDataType', validEnumEntryType],
  ['optionalDataTypes', validOptionalEntryType],
  [
    'nestedeDataTypes',
    [
      2,
      [DataEntryFactory.createFloat(0, 0, 1, 2, 'someFloat')],
      [['nested data entry', [DataEntryFactory.createFloat(0, 0, 1, 2, 'someFloat')]]],
      [['nestedOptionalExample', validEnumEntryType]],
    ],
  ],
];

export const lucernaeTuricumArcExamples: EnumEntryDataType = [
  4,
  [
    DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, 'insetTop'),
    DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, 'insetBottom'),
    DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, 'insetSides'),
  ],
  [
    DataEntryFactory.createFloat(0.35, 0.2, 1.0, 2, 'radiusTop'),
    DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, 'insetTop'),
    DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, 'insetBottom'),
    DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, 'insetSides'),
  ],
  [
    DataEntryFactory.createFloat(0.35, 0.2, 0.8, 2, 'radiusTop'),
    DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, 'insetTop'),
    DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, 'insetBottom'),
    DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, 'insetSides'),
  ],
  [
    DataEntryFactory.createFloat(0.35, 0.2, 0.8, 2, 'radiusTop'),
    DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, 'insetTop'),
    DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, 'insetBottom'),
    DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, 'insetSides'),
    DataEntryFactory.createFloat(0.25, 0.1, 0.5, 2, 'pointedness'),
  ],
  [
    DataEntryFactory.createFloat(0.35, 0.2, 1.0, 2, 'radiusTop'),
    DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, 'insetTop'),
    DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, 'insetBottom'),
    DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, 'insetSides'),
    DataEntryFactory.createFloat(1, 0, 1, 2, 'pointedness'),
    DataEntryFactory.createFloat(1, 0, 1, 2, 'divisionPointedness'),
    DataEntryFactory.createInt(1, 1, 10, 'divisionCount'),
    DataEntryFactory.createInt(1, 1, 32, 'divisionResolution'),
  ],
];

export const footprintDefinition: EnumEntryDataType = [
  3,
  [DataEntryFactory.createFloat(50, 40, 120, 0, 'size')],
  [
    DataEntryFactory.createFloat(20, 8, 120, 0, 'size'),
    DataEntryFactory.createInt(3, 1, 16, 'xCount'),
    DataEntryFactory.createInt(0, 0, 8, 'yCount'),
    DataEntryFactory.createEnum(0, 3, 'shellThickness'),
    DataEntryFactory.createFloat(2, 0, 10, 1, 'bufferInside'),
    DataEntryFactory.createFloat(2, 0, 10, 1, 'bufferOutside'),
  ],
  [
    DataEntryFactory.createFloat(20, 8, 120, 0, 'size'),
    DataEntryFactory.createInt(3, 1, 16, 'xCount'),
    DataEntryFactory.createInt(0, 0, 8, 'yCount'),
    DataEntryFactory.createEnum(0, 3, 'shellThickness'),
    DataEntryFactory.createFloat(2, 0, 10, 1, 'bufferInside'),
    DataEntryFactory.createFloat(2, 0, 10, 1, 'bufferOutside'),
  ],
  [
    DataEntryFactory.createFloat(20, 8, 120, 0, 'size'),
    DataEntryFactory.createInt(3, 1, 16, 'xCount'),
    DataEntryFactory.createInt(0, 0, 8, 'yCount'),
    DataEntryFactory.createEnum(0, 3, 'shellThickness'),
    DataEntryFactory.createFloat(2, 0, 10, 1, 'bufferInside'),
    DataEntryFactory.createFloat(2, 0, 10, 1, 'bufferOutside'),
  ],
  [
    DataEntryFactory.createFloat(2, 0, 10, 1, 'bufferInside'),
    DataEntryFactory.createFloat(12, 8, 40, 1, 'radius0'),
    DataEntryFactory.createFloat(12, 0, 40, 1, 'radius1'),
    DataEntryFactory.createFloat(12, 0, 40, 1, 'radius2'),
    DataEntryFactory.createFloat(2, 0, 10, 1, 'bufferOutside'),
    DataEntryFactory.createInt(5, 3, 20, 'segments'),
  ],

  [
    DataEntryFactory.createFloat(35, 10, 55, 1, 'circleRadius'),
    DataEntryFactory.createInt(5, 3, 20, 'circleDivisions'),
    DataEntryFactory.createFloat(0.5, 0.1, 0.9, 2, 'angleSplit'),
    DataEntryFactory.createFloat(0, -20, 20, 1, 'offsetA'),
    DataEntryFactory.createFloat(0, -20, 20, 1, 'offsetB'),
    DataEntryFactory.createFloat(5, 4, 40, 1, 'innerRadius'),
  ],
];

export const heightParsingDefinition: NestedContentType = [
  DataEntryFactory.createFloat(150, 50, 300, 0, 'totalHeight'),
  DataEntryFactory.createInt(7, 1, 20, 'storyCount'),
  [
    'heightProcessingMethod',
    [
      1,
      [DataEntryFactory.createFloat(20, 10, 200, -1, 'total'), DataEntryFactory.createFloat(5, 0, 15, 2, 'linearTwist')],
      [
        DataEntryFactory.createFloat(1, 0, 4, 1, 'maxAmplitude'),
        DataEntryFactory.createFloat(1, 0, 4, 2, 'minAmplitude'),
        DataEntryFactory.createFloat(1, 0.2, 200, 1, 'period'),
        DataEntryFactory.createFloat(0, 0, 360, 0, 'phaseShift'),
      ],
      [],
    ],
  ],
];

export const shapePreProcessingDefinition: EnumEntryDataType = [
  2,
  [
    DataEntryFactory.createBoolean(false, 'shapePreProcessingWarpabsolute'),
    DataEntryFactory.createFloat(20, 10, 200, -1, 'shapePreProcessingWarptotal'),
    DataEntryFactory.createFloat(5, 0, 15, 2, 'shapePreProcessingWarplinearTwist'),
  ],
  [
    DataEntryFactory.createBoolean(false, 'shapePreProcessingWarpabsolute'),
    DataEntryFactory.createFloat(1, 0, 4, 1, 'shapePreProcessingWarpmaxAmplitude'),
    DataEntryFactory.createFloat(1, 0, 4, 2, 'shapePreProcessingWarpminAmplitude'),
    DataEntryFactory.createFloat(500, 2, 2000, 0, 'shapePreProcessingWarpperiod'),
    DataEntryFactory.createFloat(0, 0, 1, 2, 'shapePreProcessingWarpphaseShift'),
  ],
  [],
];

export const lucernaeTurici: VersionArrayDefinitionType = [
  DataEntryFactory.createVersion(0, 4, 'version'),
  ['extrusion', lucernaeTuricumArcExamples],
  ['footprint', footprintDefinition],
  ['heights', heightParsingDefinition],
  ['shapePreProcessing', shapePreProcessingDefinition],
];

export const lucernaeTuriciVersions: ParserForVersion[] = [
  {
    version: 0,
    versionBitCount: 4,
    versionName: '0',
    objectGeneratorParameters: parseVersionArrayDefinitionTypeToVersionDefinitionObject(lucernaeTurici) as VersionDefinitionObject,
  },
];
