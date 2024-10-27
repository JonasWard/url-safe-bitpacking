import { expect, test } from 'bun:test';
import { getSemanticallyNestedValues } from '@/objectmap/versionUserMethods';
import { getURLForData, nestedDataEntryArrayToObject, parseDownNestedDataDescription, parseUrlMethod } from '../objectmap/versionReading';
import { updateDataEntry } from '../objectmap/versionUpdate';
import { parseVersionArrayDefinitionTypeToVersionDefinitionObject } from '../objectmap/versionArrayDefinitionToObjectDefintion';
import { DefinitionArrayObject } from '../types';
import { arrayVersionObjectDataType, lucernaeTurici, lucernaeTuriciVersions, versionArrayDataTypeTest } from './arrayDefinition.example';

test('lucernae turici - parse to object VersionDefinitionObject', () =>
  expect(JSON.parse(JSON.stringify(parseVersionArrayDefinitionTypeToVersionDefinitionObject(lucernaeTurici), null, 2))).toEqual([
    {
      value: 0,
      type: 0,
      bits: 4,
      name: 'version',
      index: -1,
    },
    [
      'extrusion',
      {
        value: 4,
        type: 2,
        max: 4,
        bits: 3,
        name: 'extrusion',
        index: -1,
        internalName: '__extrusion',
      },
      null,
    ],
    [
      'footprint',
      {
        value: 3,
        type: 2,
        max: 5,
        bits: 3,
        name: 'footprint',
        index: -1,
        internalName: '__footprint',
      },
      null,
    ],
    [
      'heights',
      [
        {
          value: 150,
          type: 4,
          min: 50,
          max: 300,
          precision: 0,
          significand: 8,
          name: 'totalHeight',
          index: -1,
          internalName: '__totalHeight',
        },
        {
          value: 7,
          type: 3,
          min: 1,
          max: 20,
          bits: 5,
          name: 'storyCount',
          index: -1,
          internalName: '__storyCount',
        },
        [
          'heightProcessingMethod',
          {
            value: 1,
            type: 2,
            max: 2,
            bits: 2,
            name: 'heightProcessingMethod',
            index: -1,
            internalName: '__heightProcessingMethod',
          },
          null,
        ],
      ],
    ],
    [
      'shapePreProcessing',
      {
        value: 2,
        type: 2,
        max: 2,
        bits: 2,
        name: 'shapePreProcessing',
        index: -1,
        internalName: '__shapePreProcessing',
      },
      null,
    ],
  ]));

test('lucernae turici - parsed to SemanticlyNestedDataEntry', () => {
  expect(nestedDataEntryArrayToObject(parseVersionArrayDefinitionTypeToVersionDefinitionObject(lucernaeTurici) as DefinitionArrayObject)).toEqual({
    version: {
      value: 0,
      type: 0,
      bits: 4,
      name: 'version',
      index: 0,
    },
    extrusion: {
      extrusion: {
        value: 4,
        type: 2,
        max: 4,
        bits: 3,
        name: 'extrusion',
        index: 1,
        internalName: '__extrusion',
      },
      radiusTop: {
        value: 0.35,
        type: 4,
        min: 0.2,
        max: 1,
        precision: 2,
        significand: 7,
        name: 'radiusTop',
        index: 2,
        internalName: '__extrusion_radiusTop',
      },
      insetTop: {
        value: 0.25,
        type: 4,
        min: 0.01,
        max: 0.45,
        precision: 2,
        significand: 6,
        name: 'insetTop',
        index: 3,
        internalName: '__extrusion_insetTop',
      },
      insetBottom: {
        value: 0.25,
        type: 4,
        min: 0.01,
        max: 0.45,
        precision: 2,
        significand: 6,
        name: 'insetBottom',
        index: 4,
        internalName: '__extrusion_insetBottom',
      },
      insetSides: {
        value: 0.25,
        type: 4,
        min: 0.01,
        max: 0.45,
        precision: 2,
        significand: 6,
        name: 'insetSides',
        index: 5,
        internalName: '__extrusion_insetSides',
      },
      pointedness: {
        value: 1,
        type: 4,
        min: 0,
        max: 1,
        precision: 2,
        significand: 7,
        name: 'pointedness',
        index: 6,
        internalName: '__extrusion_pointedness',
      },
      divisionPointedness: {
        value: 1,
        type: 4,
        min: 0,
        max: 1,
        precision: 2,
        significand: 7,
        name: 'divisionPointedness',
        index: 7,
        internalName: '__extrusion_divisionPointedness',
      },
      divisionCount: {
        value: 1,
        type: 3,
        min: 1,
        max: 10,
        bits: 4,
        name: 'divisionCount',
        index: 8,
        internalName: '__extrusion_divisionCount',
      },
      divisionResolution: {
        value: 1,
        type: 3,
        min: 1,
        max: 32,
        bits: 5,
        name: 'divisionResolution',
        index: 9,
        internalName: '__extrusion_divisionResolution',
      },
    },
    footprint: {
      footprint: {
        value: 3,
        type: 2,
        max: 5,
        bits: 3,
        name: 'footprint',
        index: 10,
        internalName: '__footprint',
      },
      size: {
        value: 20,
        type: 4,
        min: 8,
        max: 120,
        precision: 0,
        significand: 7,
        name: 'size',
        index: 11,
        internalName: '__footprint_size',
      },
      xCount: {
        value: 3,
        type: 3,
        min: 1,
        max: 16,
        bits: 4,
        name: 'xCount',
        index: 12,
        internalName: '__footprint_xCount',
      },
      yCount: {
        value: 0,
        type: 3,
        min: 0,
        max: 8,
        bits: 4,
        name: 'yCount',
        index: 13,
        internalName: '__footprint_yCount',
      },
      shellThickness: {
        value: 0,
        type: 2,
        max: 3,
        bits: 2,
        name: 'shellThickness',
        index: 14,
        internalName: '__footprint_shellThickness',
      },
      bufferInside: {
        value: 2,
        type: 4,
        min: 0,
        max: 10,
        precision: 1,
        significand: 7,
        name: 'bufferInside',
        index: 15,
        internalName: '__footprint_bufferInside',
      },
      bufferOutside: {
        value: 2,
        type: 4,
        min: 0,
        max: 10,
        precision: 1,
        significand: 7,
        name: 'bufferOutside',
        index: 16,
        internalName: '__footprint_bufferOutside',
      },
    },
    heights: {
      totalHeight: {
        value: 150,
        type: 4,
        min: 50,
        max: 300,
        precision: 0,
        significand: 8,
        name: 'totalHeight',
        index: 17,
        internalName: '__totalHeight',
      },
      storyCount: {
        value: 7,
        type: 3,
        min: 1,
        max: 20,
        bits: 5,
        name: 'storyCount',
        index: 18,
        internalName: '__storyCount',
      },
      heightProcessingMethod: {
        heightProcessingMethod: {
          value: 1,
          type: 2,
          max: 2,
          bits: 2,
          name: 'heightProcessingMethod',
          index: 19,
          internalName: '__heightProcessingMethod',
        },
        maxAmplitude: {
          value: 1,
          type: 4,
          min: 0,
          max: 4,
          precision: 1,
          significand: 6,
          name: 'maxAmplitude',
          index: 20,
          internalName: '__heightProcessingMethod_maxAmplitude',
        },
        minAmplitude: {
          value: 1,
          type: 4,
          min: 0,
          max: 4,
          precision: 2,
          significand: 9,
          name: 'minAmplitude',
          index: 21,
          internalName: '__heightProcessingMethod_minAmplitude',
        },
        period: {
          value: 1,
          type: 4,
          min: 0.2,
          max: 200,
          precision: 1,
          significand: 11,
          name: 'period',
          index: 22,
          internalName: '__heightProcessingMethod_period',
        },
        phaseShift: {
          value: 0,
          type: 4,
          min: 0,
          max: 360,
          precision: 0,
          significand: 9,
          name: 'phaseShift',
          index: 23,
          internalName: '__heightProcessingMethod_phaseShift',
        },
      },
    },
    shapePreProcessing: {
      shapePreProcessing: {
        value: 2,
        type: 2,
        max: 2,
        bits: 2,
        name: 'shapePreProcessing',
        index: 24,
        internalName: '__shapePreProcessing',
      },
    },
  });
});

const v0BaseStateString = 'CD2GGMmQAMYQBQoyGSjIAgAQ';

test('lucernae turici - to base64', () =>
  expect(getURLForData(nestedDataEntryArrayToObject(parseVersionArrayDefinitionTypeToVersionDefinitionObject(lucernaeTurici) as DefinitionArrayObject))).toBe(
    v0BaseStateString
  ));

test('lucernae turici - parse lucernae turici from base64', () => {
  expect(parseUrlMethod(v0BaseStateString, lucernaeTuriciVersions)).toEqual({
    version: { value: 0, type: 0, bits: 4, name: 'version', index: 0 },
    extrusion: {
      extrusion: { value: 4, type: 2, max: 4, bits: 3, name: 'extrusion', index: 1, internalName: '__extrusion' },
      radiusTop: { value: 0.35, type: 4, min: 0.2, max: 1, precision: 2, significand: 7, name: 'radiusTop', index: 2, internalName: '__extrusion_radiusTop' },
      insetTop: { value: 0.25, type: 4, min: 0.01, max: 0.45, precision: 2, significand: 6, name: 'insetTop', index: 3, internalName: '__extrusion_insetTop' },
      insetBottom: {
        value: 0.25,
        type: 4,
        min: 0.01,
        max: 0.45,
        precision: 2,
        significand: 6,
        name: 'insetBottom',
        index: 4,
        internalName: '__extrusion_insetBottom',
      },
      insetSides: {
        value: 0.25,
        type: 4,
        min: 0.01,
        max: 0.45,
        precision: 2,
        significand: 6,
        name: 'insetSides',
        index: 5,
        internalName: '__extrusion_insetSides',
      },
      pointedness: { value: 1, type: 4, min: 0, max: 1, precision: 2, significand: 7, name: 'pointedness', index: 6, internalName: '__extrusion_pointedness' },
      divisionPointedness: {
        value: 1,
        type: 4,
        min: 0,
        max: 1,
        precision: 2,
        significand: 7,
        name: 'divisionPointedness',
        index: 7,
        internalName: '__extrusion_divisionPointedness',
      },
      divisionCount: { value: 1, type: 3, min: 1, max: 10, bits: 4, name: 'divisionCount', index: 8, internalName: '__extrusion_divisionCount' },
      divisionResolution: { value: 1, type: 3, min: 1, max: 32, bits: 5, name: 'divisionResolution', index: 9, internalName: '__extrusion_divisionResolution' },
    },
    footprint: {
      footprint: { value: 3, type: 2, max: 5, bits: 3, name: 'footprint', index: 10, internalName: '__footprint' },
      size: { value: 20, type: 4, min: 8, max: 120, precision: 0, significand: 7, name: 'size', index: 11, internalName: '__footprint_size' },
      xCount: { value: 3, type: 3, min: 1, max: 16, bits: 4, name: 'xCount', index: 12, internalName: '__footprint_xCount' },
      yCount: { value: 0, type: 3, min: 0, max: 8, bits: 4, name: 'yCount', index: 13, internalName: '__footprint_yCount' },
      shellThickness: { value: 0, type: 2, max: 3, bits: 2, name: 'shellThickness', index: 14, internalName: '__footprint_shellThickness' },
      bufferInside: {
        value: 2,
        type: 4,
        min: 0,
        max: 10,
        precision: 1,
        significand: 7,
        name: 'bufferInside',
        index: 15,
        internalName: '__footprint_bufferInside',
      },
      bufferOutside: {
        value: 2,
        type: 4,
        min: 0,
        max: 10,
        precision: 1,
        significand: 7,
        name: 'bufferOutside',
        index: 16,
        internalName: '__footprint_bufferOutside',
      },
    },
    heights: {
      totalHeight: { value: 150, type: 4, min: 50, max: 300, precision: 0, significand: 8, name: 'totalHeight', index: 17, internalName: '__totalHeight' },
      storyCount: { value: 7, type: 3, min: 1, max: 20, bits: 5, name: 'storyCount', index: 18, internalName: '__storyCount' },
      heightProcessingMethod: {
        heightProcessingMethod: { value: 1, type: 2, max: 2, bits: 2, name: 'heightProcessingMethod', index: 19, internalName: '__heightProcessingMethod' },
        maxAmplitude: {
          value: 1,
          type: 4,
          min: 0,
          max: 4,
          precision: 1,
          significand: 6,
          name: 'maxAmplitude',
          index: 20,
          internalName: '__heightProcessingMethod_maxAmplitude',
        },
        minAmplitude: {
          value: 1,
          type: 4,
          min: 0,
          max: 4,
          precision: 2,
          significand: 9,
          name: 'minAmplitude',
          index: 21,
          internalName: '__heightProcessingMethod_minAmplitude',
        },
        period: {
          value: 1,
          type: 4,
          min: 0.2,
          max: 200,
          precision: 1,
          significand: 11,
          name: 'period',
          index: 22,
          internalName: '__heightProcessingMethod_period',
        },
        phaseShift: {
          value: 0,
          type: 4,
          min: 0,
          max: 360,
          precision: 0,
          significand: 9,
          name: 'phaseShift',
          index: 23,
          internalName: '__heightProcessingMethod_phaseShift',
        },
      },
    },
    shapePreProcessing: {
      shapePreProcessing: { value: 2, type: 2, max: 2, bits: 2, name: 'shapePreProcessing', index: 24, internalName: '__shapePreProcessing' },
    },
  });
});

test('lucernae turici - parseDown NestedDataEntryArray', () => {
  expect(parseDownNestedDataDescription(parseUrlMethod(v0BaseStateString, lucernaeTuriciVersions))).toEqual([
    {
      value: 0,
      type: 0,
      bits: 4,
      name: 'version',
      index: 0,
    },
    {
      value: 4,
      type: 2,
      max: 4,
      bits: 3,
      name: 'extrusion',
      index: 1,
      internalName: '__extrusion',
    },
    {
      value: 0.35,
      type: 4,
      min: 0.2,
      max: 1,
      precision: 2,
      significand: 7,
      name: 'radiusTop',
      index: 2,
      internalName: '__extrusion_radiusTop',
    },
    {
      value: 0.25,
      type: 4,
      min: 0.01,
      max: 0.45,
      precision: 2,
      significand: 6,
      name: 'insetTop',
      index: 3,
      internalName: '__extrusion_insetTop',
    },
    {
      value: 0.25,
      type: 4,
      min: 0.01,
      max: 0.45,
      precision: 2,
      significand: 6,
      name: 'insetBottom',
      index: 4,
      internalName: '__extrusion_insetBottom',
    },
    {
      value: 0.25,
      type: 4,
      min: 0.01,
      max: 0.45,
      precision: 2,
      significand: 6,
      name: 'insetSides',
      index: 5,
      internalName: '__extrusion_insetSides',
    },
    {
      value: 1,
      type: 4,
      min: 0,
      max: 1,
      precision: 2,
      significand: 7,
      name: 'pointedness',
      index: 6,
      internalName: '__extrusion_pointedness',
    },
    {
      value: 1,
      type: 4,
      min: 0,
      max: 1,
      precision: 2,
      significand: 7,
      name: 'divisionPointedness',
      index: 7,
      internalName: '__extrusion_divisionPointedness',
    },
    {
      value: 1,
      type: 3,
      min: 1,
      max: 10,
      bits: 4,
      name: 'divisionCount',
      index: 8,
      internalName: '__extrusion_divisionCount',
    },
    {
      value: 1,
      type: 3,
      min: 1,
      max: 32,
      bits: 5,
      name: 'divisionResolution',
      index: 9,
      internalName: '__extrusion_divisionResolution',
    },
    {
      value: 3,
      type: 2,
      max: 5,
      bits: 3,
      name: 'footprint',
      index: 10,
      internalName: '__footprint',
    },
    {
      value: 20,
      type: 4,
      min: 8,
      max: 120,
      precision: 0,
      significand: 7,
      name: 'size',
      index: 11,
      internalName: '__footprint_size',
    },
    {
      value: 3,
      type: 3,
      min: 1,
      max: 16,
      bits: 4,
      name: 'xCount',
      index: 12,
      internalName: '__footprint_xCount',
    },
    {
      value: 0,
      type: 3,
      min: 0,
      max: 8,
      bits: 4,
      name: 'yCount',
      index: 13,
      internalName: '__footprint_yCount',
    },
    {
      value: 0,
      type: 2,
      max: 3,
      bits: 2,
      name: 'shellThickness',
      index: 14,
      internalName: '__footprint_shellThickness',
    },
    {
      value: 2,
      type: 4,
      min: 0,
      max: 10,
      precision: 1,
      significand: 7,
      name: 'bufferInside',
      index: 15,
      internalName: '__footprint_bufferInside',
    },
    {
      value: 2,
      type: 4,
      min: 0,
      max: 10,
      precision: 1,
      significand: 7,
      name: 'bufferOutside',
      index: 16,
      internalName: '__footprint_bufferOutside',
    },
    {
      value: 150,
      type: 4,
      min: 50,
      max: 300,
      precision: 0,
      significand: 8,
      name: 'totalHeight',
      index: 17,
      internalName: '__totalHeight',
    },
    {
      value: 7,
      type: 3,
      min: 1,
      max: 20,
      bits: 5,
      name: 'storyCount',
      index: 18,
      internalName: '__storyCount',
    },
    {
      value: 1,
      type: 2,
      max: 2,
      bits: 2,
      name: 'heightProcessingMethod',
      index: 19,
      internalName: '__heightProcessingMethod',
    },
    {
      value: 1,
      type: 4,
      min: 0,
      max: 4,
      precision: 1,
      significand: 6,
      name: 'maxAmplitude',
      index: 20,
      internalName: '__heightProcessingMethod_maxAmplitude',
    },
    {
      value: 1,
      type: 4,
      min: 0,
      max: 4,
      precision: 2,
      significand: 9,
      name: 'minAmplitude',
      index: 21,
      internalName: '__heightProcessingMethod_minAmplitude',
    },
    {
      value: 1,
      type: 4,
      min: 0.2,
      max: 200,
      precision: 1,
      significand: 11,
      name: 'period',
      index: 22,
      internalName: '__heightProcessingMethod_period',
    },
    {
      value: 0,
      type: 4,
      min: 0,
      max: 360,
      precision: 0,
      significand: 9,
      name: 'phaseShift',
      index: 23,
      internalName: '__heightProcessingMethod_phaseShift',
    },
    {
      value: 2,
      type: 2,
      max: 2,
      bits: 2,
      name: 'shapePreProcessing',
      index: 24,
      internalName: '__shapePreProcessing',
    },
  ]);
});

test('lucernae turici - update height type - object', () => {
  const updatedObject = updateDataEntry(
    parseUrlMethod(v0BaseStateString, lucernaeTuriciVersions),
    {
      value: 0,
      type: 2,
      max: 2,
      bits: 2,
      name: 'heightProcessingMethod',
      index: 19,
      internalName: '__heightProcessingMethod',
    },
    lucernaeTuriciVersions.parsers
  );

  expect(updatedObject).toEqual({
    version: { value: 0, type: 0, bits: 4, name: 'version', index: 0 },
    extrusion: {
      extrusion: { value: 4, type: 2, max: 4, bits: 3, name: 'extrusion', index: 1, internalName: '__extrusion' },
      radiusTop: { value: 0.35, type: 4, min: 0.2, max: 1, precision: 2, significand: 7, name: 'radiusTop', index: 2, internalName: '__extrusion_radiusTop' },
      insetTop: { value: 0.25, type: 4, min: 0.01, max: 0.45, precision: 2, significand: 6, name: 'insetTop', index: 3, internalName: '__extrusion_insetTop' },
      insetBottom: {
        value: 0.25,
        type: 4,
        min: 0.01,
        max: 0.45,
        precision: 2,
        significand: 6,
        name: 'insetBottom',
        index: 4,
        internalName: '__extrusion_insetBottom',
      },
      insetSides: {
        value: 0.25,
        type: 4,
        min: 0.01,
        max: 0.45,
        precision: 2,
        significand: 6,
        name: 'insetSides',
        index: 5,
        internalName: '__extrusion_insetSides',
      },
      pointedness: { value: 1, type: 4, min: 0, max: 1, precision: 2, significand: 7, name: 'pointedness', index: 6, internalName: '__extrusion_pointedness' },
      divisionPointedness: {
        value: 1,
        type: 4,
        min: 0,
        max: 1,
        precision: 2,
        significand: 7,
        name: 'divisionPointedness',
        index: 7,
        internalName: '__extrusion_divisionPointedness',
      },
      divisionCount: { value: 1, type: 3, min: 1, max: 10, bits: 4, name: 'divisionCount', index: 8, internalName: '__extrusion_divisionCount' },
      divisionResolution: { value: 1, type: 3, min: 1, max: 32, bits: 5, name: 'divisionResolution', index: 9, internalName: '__extrusion_divisionResolution' },
    },
    footprint: {
      footprint: { value: 3, type: 2, max: 5, bits: 3, name: 'footprint', index: 10, internalName: '__footprint' },
      size: { value: 20, type: 4, min: 8, max: 120, precision: 0, significand: 7, name: 'size', index: 11, internalName: '__footprint_size' },
      xCount: { value: 3, type: 3, min: 1, max: 16, bits: 4, name: 'xCount', index: 12, internalName: '__footprint_xCount' },
      yCount: { value: 0, type: 3, min: 0, max: 8, bits: 4, name: 'yCount', index: 13, internalName: '__footprint_yCount' },
      shellThickness: { value: 0, type: 2, max: 3, bits: 2, name: 'shellThickness', index: 14, internalName: '__footprint_shellThickness' },
      bufferInside: {
        value: 2,
        type: 4,
        min: 0,
        max: 10,
        precision: 1,
        significand: 7,
        name: 'bufferInside',
        index: 15,
        internalName: '__footprint_bufferInside',
      },
      bufferOutside: {
        value: 2,
        type: 4,
        min: 0,
        max: 10,
        precision: 1,
        significand: 7,
        name: 'bufferOutside',
        index: 16,
        internalName: '__footprint_bufferOutside',
      },
    },
    heights: {
      totalHeight: { value: 150, type: 4, min: 50, max: 300, precision: 0, significand: 8, name: 'totalHeight', index: 17, internalName: '__totalHeight' },
      storyCount: { value: 7, type: 3, min: 1, max: 20, bits: 5, name: 'storyCount', index: 18, internalName: '__storyCount' },
      heightProcessingMethod: {
        heightProcessingMethod: { value: 0, type: 2, max: 2, bits: 2, name: 'heightProcessingMethod', index: 19, internalName: '__heightProcessingMethod' },
        total: {
          value: 20,
          type: 4,
          min: 10,
          max: 200,
          precision: -1,
          significand: 5,
          name: 'total',
          index: 20,
          internalName: '__heightProcessingMethod_total',
        },
        linearTwist: {
          value: 5,
          type: 4,
          min: 0,
          max: 15,
          precision: 2,
          significand: 11,
          name: 'linearTwist',
          index: 21,
          internalName: '__heightProcessingMethod_linearTwist',
        },
      },
    },
    shapePreProcessing: {
      shapePreProcessing: { value: 2, type: 2, max: 2, bits: 2, name: 'shapePreProcessing', index: 22, internalName: '__shapePreProcessing' },
    },
  });
});

test('lucernae turici - update height type - object', () => {
  const updatedDataEntryArray = parseDownNestedDataDescription(
    updateDataEntry(
      parseUrlMethod(v0BaseStateString, lucernaeTuriciVersions),
      {
        value: 0,
        type: 2,
        max: 2,
        bits: 2,
        name: 'heightProcessingMethod',
        index: 19,
        internalName: '__heightProcessingMethod',
      },
      lucernaeTuriciVersions.parsers
    )
  );

  expect(updatedDataEntryArray).toEqual([
    {
      value: 0,
      type: 0,
      bits: 4,
      name: 'version',
      index: 0,
    },
    {
      value: 4,
      type: 2,
      max: 4,
      bits: 3,
      name: 'extrusion',
      index: 1,
      internalName: '__extrusion',
    },
    {
      value: 0.35,
      type: 4,
      min: 0.2,
      max: 1,
      precision: 2,
      significand: 7,
      name: 'radiusTop',
      index: 2,
      internalName: '__extrusion_radiusTop',
    },
    {
      value: 0.25,
      type: 4,
      min: 0.01,
      max: 0.45,
      precision: 2,
      significand: 6,
      name: 'insetTop',
      index: 3,
      internalName: '__extrusion_insetTop',
    },
    {
      value: 0.25,
      type: 4,
      min: 0.01,
      max: 0.45,
      precision: 2,
      significand: 6,
      name: 'insetBottom',
      index: 4,
      internalName: '__extrusion_insetBottom',
    },
    {
      value: 0.25,
      type: 4,
      min: 0.01,
      max: 0.45,
      precision: 2,
      significand: 6,
      name: 'insetSides',
      index: 5,
      internalName: '__extrusion_insetSides',
    },
    {
      value: 1,
      type: 4,
      min: 0,
      max: 1,
      precision: 2,
      significand: 7,
      name: 'pointedness',
      index: 6,
      internalName: '__extrusion_pointedness',
    },
    {
      value: 1,
      type: 4,
      min: 0,
      max: 1,
      precision: 2,
      significand: 7,
      name: 'divisionPointedness',
      index: 7,
      internalName: '__extrusion_divisionPointedness',
    },
    {
      value: 1,
      type: 3,
      min: 1,
      max: 10,
      bits: 4,
      name: 'divisionCount',
      index: 8,
      internalName: '__extrusion_divisionCount',
    },
    {
      value: 1,
      type: 3,
      min: 1,
      max: 32,
      bits: 5,
      name: 'divisionResolution',
      index: 9,
      internalName: '__extrusion_divisionResolution',
    },
    {
      value: 3,
      type: 2,
      max: 5,
      bits: 3,
      name: 'footprint',
      index: 10,
      internalName: '__footprint',
    },
    {
      value: 20,
      type: 4,
      min: 8,
      max: 120,
      precision: 0,
      significand: 7,
      name: 'size',
      index: 11,
      internalName: '__footprint_size',
    },
    {
      value: 3,
      type: 3,
      min: 1,
      max: 16,
      bits: 4,
      name: 'xCount',
      index: 12,
      internalName: '__footprint_xCount',
    },
    {
      value: 0,
      type: 3,
      min: 0,
      max: 8,
      bits: 4,
      name: 'yCount',
      index: 13,
      internalName: '__footprint_yCount',
    },
    {
      value: 0,
      type: 2,
      max: 3,
      bits: 2,
      name: 'shellThickness',
      index: 14,
      internalName: '__footprint_shellThickness',
    },
    {
      value: 2,
      type: 4,
      min: 0,
      max: 10,
      precision: 1,
      significand: 7,
      name: 'bufferInside',
      index: 15,
      internalName: '__footprint_bufferInside',
    },
    {
      value: 2,
      type: 4,
      min: 0,
      max: 10,
      precision: 1,
      significand: 7,
      name: 'bufferOutside',
      index: 16,
      internalName: '__footprint_bufferOutside',
    },
    {
      value: 150,
      type: 4,
      min: 50,
      max: 300,
      precision: 0,
      significand: 8,
      name: 'totalHeight',
      index: 17,
      internalName: '__totalHeight',
    },
    {
      value: 7,
      type: 3,
      min: 1,
      max: 20,
      bits: 5,
      name: 'storyCount',
      index: 18,
      internalName: '__storyCount',
    },
    {
      value: 0,
      type: 2,
      max: 2,
      bits: 2,
      name: 'heightProcessingMethod',
      index: 19,
      internalName: '__heightProcessingMethod',
    },
    {
      value: 20,
      type: 4,
      min: 10,
      max: 200,
      precision: -1,
      significand: 5,
      name: 'total',
      index: 20,
      internalName: '__heightProcessingMethod_total',
    },
    {
      value: 5,
      type: 4,
      min: 0,
      max: 15,
      precision: 2,
      significand: 11,
      name: 'linearTwist',
      index: 21,
      internalName: '__heightProcessingMethod_linearTwist',
    },
    {
      value: 2,
      type: 2,
      max: 2,
      bits: 2,
      name: 'shapePreProcessing',
      index: 22,
      internalName: '__shapePreProcessing',
    },
  ]);
});

test('lucernae turici - semantically nested values object', () => {
  const semanticallyNestedValues = getSemanticallyNestedValues(parseUrlMethod(v0BaseStateString, lucernaeTuriciVersions), lucernaeTuriciVersions);

  expect(semanticallyNestedValues).toEqual({
    version: 0,
    extrusion: {
      extrusion: 4,
      radiusTop: 0.35,
      insetTop: 0.25,
      insetBottom: 0.25,
      insetSides: 0.25,
      pointedness: 1,
      divisionPointedness: 1,
      divisionCount: 1,
      divisionResolution: 1,
    },
    footprint: {
      footprint: 3,
      size: 20,
      xCount: 3,
      yCount: 0,
      shellThickness: 0,
      bufferInside: 2,
      bufferOutside: 2,
    },
    heights: {
      totalHeight: 150,
      storyCount: 7,
      heightProcessingMethod: {
        heightProcessingMethod: 1,
        maxAmplitude: 1,
        minAmplitude: 1,
        period: 1,
        phaseShift: 0,
      },
    },
    shapePreProcessing: {
      shapePreProcessing: 2,
    },
  });
});

const arrayDataString = 'Ag';

test('versionArrayDataTypeTest - to base64', () =>
  expect(
    getURLForData(nestedDataEntryArrayToObject(parseVersionArrayDefinitionTypeToVersionDefinitionObject(versionArrayDataTypeTest) as DefinitionArrayObject))
  ).toBe(arrayDataString));

test('versionArrayDataTypeTest - to semantic nested value object', () =>
  expect(nestedDataEntryArrayToObject(parseVersionArrayDefinitionTypeToVersionDefinitionObject(versionArrayDataTypeTest) as DefinitionArrayObject)).toEqual({
    version: {
      value: 0,
      type: 0,
      bits: 4,
      name: 'version',
      index: 0,
    },
    arrayDataTypeTest: {
      arrayDataTypeTest: {
        value: 1,
        type: 3,
        min: 1,
        max: 3,
        bits: 2,
        name: 'arrayDataTypeTest',
        index: 1,
        internalName: '__arrayDataTypeTest',
      },
      someBoolean: {
        value: true,
        type: 1,
        name: 'someBoolean',
        index: 2,
        internalName: '__arrayDataTypeTest_0_someBoolean',
      },
    },
  }));

test('versionArrayDataTypeTest - to semantic nested value object', () => {
  const updatedObject = updateDataEntry(
    parseUrlMethod(arrayDataString, arrayVersionObjectDataType),
    {
      value: 3,
      type: 3,
      min: 1,
      max: 3,
      bits: 2,
      name: 'arrayDataTypeTest',
      index: 1,
      internalName: '__arrayDataTypeTest',
    },
    arrayVersionObjectDataType.parsers
  );

  expect(updatedObject).toEqual({});
});
