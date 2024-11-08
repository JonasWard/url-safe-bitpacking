import { expect, test } from 'bun:test';
import {
  getStateDataTypeForArrayEntryDataType,
  getStateDataTypeForEnumEntryDataType,
  getStateDataTypeForOptionalEntryDataType,
  getStateDataTypeForSingleLevelContentTypeArray,
  getStateDataTypeNestedContentType,
} from '../typeFactory/stateDataTyping';

import { ncdt_0, ncdt_1, ncdt_2, oedt_0, oedt_1, oedt_2, eedt_0, eedt_1, eedt_2, aedt_0, aedt_1, aedt_2, lucernaeTurici } from './arrayDefinition.example';
import { verionArrayDefinition0 } from './glslRayMarching.example';

const ncdt_strings = [
  '{\n  ["someFloat"]: { value: number, name: "someFloat", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n}',
  '{\n  ["aBoolean"]: { value: boolean, name: "aBoolean", type: DataType.BOOLEAN }\n}',
  '{\n  ["anEnum"]: { value: number, name: "anEnum", type: DataType.ENUM, max: 4, bits: 3 }\n}',
];

test.only('type parsing - NestedContendDataType - method computing', () =>
  [ncdt_0, ncdt_1, ncdt_2].forEach((ncdt, i) => expect(getStateDataTypeNestedContentType(ncdt[1], ncdt[0])).toBe(ncdt_strings[i])));

const oedt_strings = [
  '  {\n    s: { value: true, name: "", type: DataType.BOOLEAN },\n    v: \n    {\n      ["someFloat"]: { value: number, name: "someFloat", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n    }\n  } | \n    {\n    s: { value: false, name: "", type: DataType.BOOLEAN },\n    v: \n    {\n    \n    }\n  }',
  '  {\n    s: { value: true, name: "", type: DataType.BOOLEAN },\n    v: \n    {\n    \n    }\n  } | \n    {\n    s: { value: false, name: "", type: DataType.BOOLEAN },\n    v: \n    {\n      ["someFloat"]: { value: number, name: "someFloat", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n    }\n  }',
  '  {\n    s: { value: true, name: "", type: DataType.BOOLEAN },\n    v: \n    {\n    \n    }\n  } | \n    {\n    s: { value: false, name: "", type: DataType.BOOLEAN },\n    v: \n    {\n      ["someFloat"]: { value: number, name: "someFloat", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n    }\n  }',
];

test.only('type parsing - NestedContendDataType - method computing', () =>
  [oedt_0, oedt_1, oedt_2].forEach((oedt, i) => expect(getStateDataTypeForOptionalEntryDataType(oedt, '')).toBe(oedt_strings[i])));

const eedt_strings = [
  '  {\n    s: { value: 0, name: "", type: DataType.ENUM, max: 2, bits: 2 },\n    v: \n    {\n      ["someFloat_eedt_0_0"]: { value: number, name: "someFloat_eedt_0_0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n    }\n  } |\n  {\n    s: { value: 1, name: "", type: DataType.ENUM, max: 2, bits: 2 },\n    v: \n    {\n      ["someFloat_eedt_0_1"]: { value: number, name: "someFloat_eedt_0_1", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n    }\n  } |\n  {\n    s: { value: 2, name: "", type: DataType.ENUM, max: 2, bits: 2 },\n    v: \n    {\n      ["someFloat_eedt_0_2"]: { value: number, name: "someFloat_eedt_0_2", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n    }\n  }',
  '  {\n    s: { value: 0, name: "", type: DataType.ENUM, max: 1, bits: 1 },\n    v: \n    {\n      ["someFloat_eedt_1_0"]: { value: number, name: "someFloat_eedt_1_0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n    }\n  } |\n  {\n    s: { value: 1, name: "", type: DataType.ENUM, max: 1, bits: 1 },\n    v: \n    {\n      ["someFloat_eedt_1_1"]: { value: number, name: "someFloat_eedt_1_1", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n    }\n  }',
  '  {\n    s: { value: 0, name: "", type: DataType.ENUM, max: 3, bits: 2 },\n    v: \n    {\n      ["someFloat_eedt_2_0"]: { value: number, name: "someFloat_eedt_2_0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n    }\n  } |\n  {\n    s: { value: 1, name: "", type: DataType.ENUM, max: 3, bits: 2 },\n    v: \n    {\n      ["someFloat_eedt_2_1"]: { value: number, name: "someFloat_eedt_2_1", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n    }\n  } |\n  {\n    s: { value: 2, name: "", type: DataType.ENUM, max: 3, bits: 2 },\n    v: \n    {\n      ["someFloat_eedt_2_2"]: { value: number, name: "someFloat_eedt_2_2", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n    }\n  } |\n  {\n    s: { value: 3, name: "", type: DataType.ENUM, max: 3, bits: 2 },\n    v: \n    {\n      ["someFloat_eedt_2_3"]: { value: number, name: "someFloat_eedt_2_3", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n    }\n  }',
];

test.only('type parsing - NestedContendDataType - method computing', () =>
  [eedt_0, eedt_1, eedt_2].forEach((eedt, i) => expect(getStateDataTypeForEnumEntryDataType(eedt, '')).toBe(eedt_strings[i])));

const aedt_strings = [
  '  {\n    s: { value: 0, name: "", type: DataType.INT, min: 0, max: 3, bits: 2 },\n    v: \n    [\n      {\n        ["aedt_0_someFloat0"]: { value: number, name: "aedt_0_someFloat0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n      }\n    ]\n  } |\n  {\n    s: { value: 1, name: "", type: DataType.INT, min: 0, max: 3, bits: 2 },\n    v: \n    [\n      {\n        ["aedt_0_someFloat0"]: { value: number, name: "aedt_0_someFloat0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n      },\n      {\n        ["aedt_0_someFloat0"]: { value: number, name: "aedt_0_someFloat0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n      }\n    ]\n  } |\n  {\n    s: { value: 2, name: "", type: DataType.INT, min: 0, max: 3, bits: 2 },\n    v: \n    [\n      {\n        ["aedt_0_someFloat0"]: { value: number, name: "aedt_0_someFloat0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n      },\n      {\n        ["aedt_0_someFloat0"]: { value: number, name: "aedt_0_someFloat0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n      },\n      {\n        ["aedt_0_someFloat0"]: { value: number, name: "aedt_0_someFloat0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n      }\n    ]\n  }',
  '  {\n    s: { value: 1, name: "", type: DataType.INT, min: 1, max: 2, bits: 1 },\n    v: \n    [\n      {\n        ["someFloat0"]: { value: number, name: "someFloat0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 },\n        ["aedt_1_someFloat1"]: { value: number, name: "aedt_1_someFloat1", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n      },\n      {\n        ["someFloat0"]: { value: number, name: "someFloat0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 },\n        ["aedt_1_someFloat1"]: { value: number, name: "aedt_1_someFloat1", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n      }\n    ]\n  }',
  '  {\n    s: { value: 2, name: "", type: DataType.INT, min: 2, max: 4, bits: 2 },\n    v: \n    [\n      {\n        ["someFloat0"]: { value: number, name: "someFloat0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 },\n        ["aedt_2_someFloat1"]: { value: number, name: "aedt_2_someFloat1", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n      },\n      {\n        ["someFloat0"]: { value: number, name: "someFloat0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 },\n        ["aedt_2_someFloat1"]: { value: number, name: "aedt_2_someFloat1", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n      },\n      {\n        ["someFloat0"]: { value: number, name: "someFloat0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 },\n        ["aedt_2_someFloat1"]: { value: number, name: "aedt_2_someFloat1", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n      }\n    ]\n  } |\n  {\n    s: { value: 3, name: "", type: DataType.INT, min: 2, max: 4, bits: 2 },\n    v: \n    [\n      {\n        ["someFloat0"]: { value: number, name: "someFloat0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 },\n        ["aedt_2_someFloat1"]: { value: number, name: "aedt_2_someFloat1", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n      },\n      {\n        ["someFloat0"]: { value: number, name: "someFloat0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 },\n        ["aedt_2_someFloat1"]: { value: number, name: "aedt_2_someFloat1", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n      },\n      {\n        ["someFloat0"]: { value: number, name: "someFloat0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 },\n        ["aedt_2_someFloat1"]: { value: number, name: "aedt_2_someFloat1", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n      },\n      {\n        ["someFloat0"]: { value: number, name: "someFloat0", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 },\n        ["aedt_2_someFloat1"]: { value: number, name: "aedt_2_someFloat1", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }\n      }\n    ]\n  }',
];

test.only('type parsing - NestedContendDataType - method computing', () =>
  [aedt_0, aedt_1, aedt_2].forEach((aedt, i) => expect(getStateDataTypeForArrayEntryDataType(aedt, '')).toBe(aedt_strings[i])));

const lucernaeType = `{
  ["extrusion"]:   {
      s: { value: 0, name: "extrusion", type: DataType.ENUM, max: 4, bits: 3 },
      v: 
      {
        ["insetTop"]: { value: number, name: "insetTop", type: DataType.FLOAT, min: 0.01, max: 0.45, precision: 2, significand: 6 },
        ["insetBottom"]: { value: number, name: "insetBottom", type: DataType.FLOAT, min: 0.01, max: 0.45, precision: 2, significand: 6 },
        ["insetSides"]: { value: number, name: "insetSides", type: DataType.FLOAT, min: 0.01, max: 0.45, precision: 2, significand: 6 }
      }
    } |
    {
      s: { value: 1, name: "extrusion", type: DataType.ENUM, max: 4, bits: 3 },
      v: 
      {
        ["radiusTop"]: { value: number, name: "radiusTop", type: DataType.FLOAT, min: 0.2, max: 1, precision: 2, significand: 7 },
        ["insetTop"]: { value: number, name: "insetTop", type: DataType.FLOAT, min: 0.01, max: 0.45, precision: 2, significand: 6 },
        ["insetBottom"]: { value: number, name: "insetBottom", type: DataType.FLOAT, min: 0.01, max: 0.45, precision: 2, significand: 6 },
        ["insetSides"]: { value: number, name: "insetSides", type: DataType.FLOAT, min: 0.01, max: 0.45, precision: 2, significand: 6 }
      }
    } |
    {
      s: { value: 2, name: "extrusion", type: DataType.ENUM, max: 4, bits: 3 },
      v: 
      {
        ["radiusTop"]: { value: number, name: "radiusTop", type: DataType.FLOAT, min: 0.2, max: 0.8, precision: 2, significand: 6 },
        ["insetTop"]: { value: number, name: "insetTop", type: DataType.FLOAT, min: 0.01, max: 0.45, precision: 2, significand: 6 },
        ["insetBottom"]: { value: number, name: "insetBottom", type: DataType.FLOAT, min: 0.01, max: 0.45, precision: 2, significand: 6 },
        ["insetSides"]: { value: number, name: "insetSides", type: DataType.FLOAT, min: 0.01, max: 0.45, precision: 2, significand: 6 }
      }
    } |
    {
      s: { value: 3, name: "extrusion", type: DataType.ENUM, max: 4, bits: 3 },
      v: 
      {
        ["radiusTop"]: { value: number, name: "radiusTop", type: DataType.FLOAT, min: 0.2, max: 0.8, precision: 2, significand: 6 },
        ["insetTop"]: { value: number, name: "insetTop", type: DataType.FLOAT, min: 0.01, max: 0.45, precision: 2, significand: 6 },
        ["insetBottom"]: { value: number, name: "insetBottom", type: DataType.FLOAT, min: 0.01, max: 0.45, precision: 2, significand: 6 },
        ["insetSides"]: { value: number, name: "insetSides", type: DataType.FLOAT, min: 0.01, max: 0.45, precision: 2, significand: 6 },
        ["pointedness"]: { value: number, name: "pointedness", type: DataType.FLOAT, min: 0.1, max: 0.5, precision: 2, significand: 6 }
      }
    } |
    {
      s: { value: 4, name: "extrusion", type: DataType.ENUM, max: 4, bits: 3 },
      v: 
      {
        ["radiusTop"]: { value: number, name: "radiusTop", type: DataType.FLOAT, min: 0.2, max: 1, precision: 2, significand: 7 },
        ["insetTop"]: { value: number, name: "insetTop", type: DataType.FLOAT, min: 0.01, max: 0.45, precision: 2, significand: 6 },
        ["insetBottom"]: { value: number, name: "insetBottom", type: DataType.FLOAT, min: 0.01, max: 0.45, precision: 2, significand: 6 },
        ["insetSides"]: { value: number, name: "insetSides", type: DataType.FLOAT, min: 0.01, max: 0.45, precision: 2, significand: 6 },
        ["pointedness"]: { value: number, name: "pointedness", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 },
        ["divisionPointedness"]: { value: number, name: "divisionPointedness", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 },
        ["divisionCount"]: { value: number, name: "divisionCount", type: DataType.INT, min: 1, max: 10, bits: 4 },
        ["divisionResolution"]: { value: number, name: "divisionResolution", type: DataType.INT, min: 1, max: 32, bits: 5 }
      }
    },
  ["footprint"]:   {
      s: { value: 0, name: "footprint", type: DataType.ENUM, max: 5, bits: 3 },
      v: 
      {
        ["size"]: { value: number, name: "size", type: DataType.FLOAT, min: 40, max: 120, precision: 0, significand: 7 }
      }
    } |
    {
      s: { value: 1, name: "footprint", type: DataType.ENUM, max: 5, bits: 3 },
      v: 
      {
        ["size"]: { value: number, name: "size", type: DataType.FLOAT, min: 8, max: 120, precision: 0, significand: 7 },
        ["xCount"]: { value: number, name: "xCount", type: DataType.INT, min: 1, max: 16, bits: 4 },
        ["yCount"]: { value: number, name: "yCount", type: DataType.INT, min: 0, max: 8, bits: 4 },
        ["shellThickness"]: { value: number, name: "shellThickness", type: DataType.ENUM, max: 3, bits: 2 },
        ["bufferInside"]: { value: number, name: "bufferInside", type: DataType.FLOAT, min: 0, max: 10, precision: 1, significand: 7 },
        ["bufferOutside"]: { value: number, name: "bufferOutside", type: DataType.FLOAT, min: 0, max: 10, precision: 1, significand: 7 }
      }
    } |
    {
      s: { value: 2, name: "footprint", type: DataType.ENUM, max: 5, bits: 3 },
      v: 
      {
        ["size"]: { value: number, name: "size", type: DataType.FLOAT, min: 8, max: 120, precision: 0, significand: 7 },
        ["xCount"]: { value: number, name: "xCount", type: DataType.INT, min: 1, max: 16, bits: 4 },
        ["yCount"]: { value: number, name: "yCount", type: DataType.INT, min: 0, max: 8, bits: 4 },
        ["shellThickness"]: { value: number, name: "shellThickness", type: DataType.ENUM, max: 3, bits: 2 },
        ["bufferInside"]: { value: number, name: "bufferInside", type: DataType.FLOAT, min: 0, max: 10, precision: 1, significand: 7 },
        ["bufferOutside"]: { value: number, name: "bufferOutside", type: DataType.FLOAT, min: 0, max: 10, precision: 1, significand: 7 }
      }
    } |
    {
      s: { value: 3, name: "footprint", type: DataType.ENUM, max: 5, bits: 3 },
      v: 
      {
        ["size"]: { value: number, name: "size", type: DataType.FLOAT, min: 8, max: 120, precision: 0, significand: 7 },
        ["xCount"]: { value: number, name: "xCount", type: DataType.INT, min: 1, max: 16, bits: 4 },
        ["yCount"]: { value: number, name: "yCount", type: DataType.INT, min: 0, max: 8, bits: 4 },
        ["shellThickness"]: { value: number, name: "shellThickness", type: DataType.ENUM, max: 3, bits: 2 },
        ["bufferInside"]: { value: number, name: "bufferInside", type: DataType.FLOAT, min: 0, max: 10, precision: 1, significand: 7 },
        ["bufferOutside"]: { value: number, name: "bufferOutside", type: DataType.FLOAT, min: 0, max: 10, precision: 1, significand: 7 }
      }
    } |
    {
      s: { value: 4, name: "footprint", type: DataType.ENUM, max: 5, bits: 3 },
      v: 
      {
        ["bufferInside"]: { value: number, name: "bufferInside", type: DataType.FLOAT, min: 0, max: 10, precision: 1, significand: 7 },
        ["radius0"]: { value: number, name: "radius0", type: DataType.FLOAT, min: 8, max: 40, precision: 1, significand: 9 },
        ["radius1"]: { value: number, name: "radius1", type: DataType.FLOAT, min: 0, max: 40, precision: 1, significand: 9 },
        ["radius2"]: { value: number, name: "radius2", type: DataType.FLOAT, min: 0, max: 40, precision: 1, significand: 9 },
        ["bufferOutside"]: { value: number, name: "bufferOutside", type: DataType.FLOAT, min: 0, max: 10, precision: 1, significand: 7 },
        ["segments"]: { value: number, name: "segments", type: DataType.INT, min: 3, max: 20, bits: 5 }
      }
    } |
    {
      s: { value: 5, name: "footprint", type: DataType.ENUM, max: 5, bits: 3 },
      v: 
      {
        ["circleRadius"]: { value: number, name: "circleRadius", type: DataType.FLOAT, min: 10, max: 55, precision: 1, significand: 9 },
        ["circleDivisions"]: { value: number, name: "circleDivisions", type: DataType.INT, min: 3, max: 20, bits: 5 },
        ["angleSplit"]: { value: number, name: "angleSplit", type: DataType.FLOAT, min: 0.1, max: 0.9, precision: 2, significand: 7 },
        ["offsetA"]: { value: number, name: "offsetA", type: DataType.FLOAT, min: -20, max: 20, precision: 1, significand: 9 },
        ["offsetB"]: { value: number, name: "offsetB", type: DataType.FLOAT, min: -20, max: 20, precision: 1, significand: 9 },
        ["innerRadius"]: { value: number, name: "innerRadius", type: DataType.FLOAT, min: 4, max: 40, precision: 1, significand: 9 }
      }
    },
  ["heights"]: {
    ["totalHeight"]: { value: number, name: "totalHeight", type: DataType.FLOAT, min: 50, max: 300, precision: 0, significand: 8 },
    ["storyCount"]: { value: number, name: "storyCount", type: DataType.INT, min: 1, max: 20, bits: 5 },
    ["heightProcessingMethod"]:   {
        s: { value: 0, name: "heightProcessingMethod", type: DataType.ENUM, max: 2, bits: 2 },
        v: 
        {
          ["total"]: { value: number, name: "total", type: DataType.FLOAT, min: 10, max: 200, precision: -1, significand: 5 },
          ["linearTwist"]: { value: number, name: "linearTwist", type: DataType.FLOAT, min: 0, max: 15, precision: 2, significand: 11 }
        }
      } |
      {
        s: { value: 1, name: "heightProcessingMethod", type: DataType.ENUM, max: 2, bits: 2 },
        v: 
        {
          ["maxAmplitude"]: { value: number, name: "maxAmplitude", type: DataType.FLOAT, min: 0, max: 4, precision: 1, significand: 6 },
          ["minAmplitude"]: { value: number, name: "minAmplitude", type: DataType.FLOAT, min: 0, max: 4, precision: 2, significand: 9 },
          ["period"]: { value: number, name: "period", type: DataType.FLOAT, min: 0.2, max: 200, precision: 1, significand: 11 },
          ["phaseShift"]: { value: number, name: "phaseShift", type: DataType.FLOAT, min: 0, max: 360, precision: 0, significand: 9 }
        }
      } |
      {
        s: { value: 2, name: "heightProcessingMethod", type: DataType.ENUM, max: 2, bits: 2 },
        v: 
        {
        
        }
      }
  },
  ["shapePreProcessing"]:   {
      s: { value: 0, name: "shapePreProcessing", type: DataType.ENUM, max: 2, bits: 2 },
      v: 
      {
        ["shapePreProcessingWarpabsolute"]: { value: boolean, name: "shapePreProcessingWarpabsolute", type: DataType.BOOLEAN },
        ["shapePreProcessingWarptotal"]: { value: number, name: "shapePreProcessingWarptotal", type: DataType.FLOAT, min: 10, max: 200, precision: -1, significand: 5 },
        ["shapePreProcessingWarplinearTwist"]: { value: number, name: "shapePreProcessingWarplinearTwist", type: DataType.FLOAT, min: 0, max: 15, precision: 2, significand: 11 }
      }
    } |
    {
      s: { value: 1, name: "shapePreProcessing", type: DataType.ENUM, max: 2, bits: 2 },
      v: 
      {
        ["shapePreProcessingWarpabsolute"]: { value: boolean, name: "shapePreProcessingWarpabsolute", type: DataType.BOOLEAN },
        ["shapePreProcessingWarpmaxAmplitude"]: { value: number, name: "shapePreProcessingWarpmaxAmplitude", type: DataType.FLOAT, min: 0, max: 4, precision: 1, significand: 6 },
        ["shapePreProcessingWarpminAmplitude"]: { value: number, name: "shapePreProcessingWarpminAmplitude", type: DataType.FLOAT, min: 0, max: 4, precision: 2, significand: 9 },
        ["shapePreProcessingWarpperiod"]: { value: number, name: "shapePreProcessingWarpperiod", type: DataType.FLOAT, min: 2, max: 2000, precision: 0, significand: 11 },
        ["shapePreProcessingWarpphaseShift"]: { value: number, name: "shapePreProcessingWarpphaseShift", type: DataType.FLOAT, min: 0, max: 1, precision: 2, significand: 7 }
      }
    } |
    {
      s: { value: 2, name: "shapePreProcessing", type: DataType.ENUM, max: 2, bits: 2 },
      v: 
      {
      
      }
    }
}`;

test.only('testing type parsing of lucernaeTurici', () => expect(getStateDataTypeForSingleLevelContentTypeArray(lucernaeTurici)).toEqual(lucernaeType));

const glslRayMarching_typeString = `{
  ["Viewport"]: {
    ["Canvas Full Screen"]:   {
        s: { value: true, name: "Canvas Full Screen", type: DataType.BOOLEAN },
        v: 
        {
          ["Canvas Width"]: { value: number, name: "Canvas Width", type: DataType.INT, min: 200, max: 4200, bits: 12 },
          ["Canvas Height"]: { value: number, name: "Canvas Height", type: DataType.INT, min: 200, max: 4200, bits: 12 }
        }
      } | 
        {
        s: { value: false, name: "Canvas Full Screen", type: DataType.BOOLEAN },
        v: 
        {
        
        }
      },
    ["Origin"]: {
      ["X"]: { value: number, name: "X", type: DataType.FLOAT, min: -500, max: 500, precision: 3, significand: 20 },
      ["Y"]: { value: number, name: "Y", type: DataType.FLOAT, min: -500, max: 500, precision: 3, significand: 20 },
      ["Z"]: { value: number, name: "Z", type: DataType.FLOAT, min: -500, max: 500, precision: 3, significand: 20 }
    },
    ["Euler Angles"]: {
      ["Pitch"]: { value: number, name: "Pitch", type: DataType.FLOAT, min: -180, max: 180, precision: 1, significand: 12 },
      ["Roll"]: { value: number, name: "Roll", type: DataType.FLOAT, min: -180, max: 180, precision: 1, significand: 12 },
      ["Yaw"]: { value: number, name: "Yaw", type: DataType.FLOAT, min: -180, max: 180, precision: 1, significand: 12 }
    },
    ["Mouse Position"]: {
      ["Rotation"]: { value: number, name: "Rotation", type: DataType.FLOAT, min: 0, max: 360, precision: 1, significand: 12 },
      ["Zoom Level"]: { value: number, name: "Zoom Level", type: DataType.FLOAT, min: 0.001, max: 1000, precision: 3, significand: 20 },
      ["Center Coordinate"]: {
        ["Position X"]: { value: number, name: "Position X", type: DataType.FLOAT, min: -1, max: 1, precision: 3, significand: 11 },
        ["Position Y"]: { value: number, name: "Position Y", type: DataType.FLOAT, min: -1, max: 1, precision: 3, significand: 11 }
      }
    }
  },
  ["Methods"]: {
    ["PreProcessing Methods"]:   {
        s: { value: true, name: "PreProcessing Methods", type: DataType.BOOLEAN },
        v: 
        {
        
        }
      } | 
        {
        s: { value: false, name: "PreProcessing Methods", type: DataType.BOOLEAN },
        v: 
        {
          ["MethodEnumPre"]: { value: number, name: "MethodEnumPre", type: DataType.ENUM, max: 1, bits: 1 },
          ["X Spacing"]: { value: number, name: "X Spacing", type: DataType.FLOAT, min: 0.1, max: 100, precision: 3, significand: 17 },
          ["Y Spacing"]: { value: number, name: "Y Spacing", type: DataType.FLOAT, min: 0.1, max: 100, precision: 3, significand: 17 }
        }
      },
    ["Main Methods"]:   {
        s: { value: 1, name: "Main Methods", type: DataType.INT, min: 1, max: 3, bits: 2 },
        v: 
        [
          {
            ["MainMethodEnum"]: { value: number, name: "MainMethodEnum", type: DataType.ENUM, max: 5, bits: 3 },
            ["MethodScale"]: { value: number, name: "MethodScale", type: DataType.FLOAT, min: 0.001, max: 1000, precision: 3, significand: 20 }
          },
          {
            ["MainMethodEnum"]: { value: number, name: "MainMethodEnum", type: DataType.ENUM, max: 5, bits: 3 },
            ["MethodScale"]: { value: number, name: "MethodScale", type: DataType.FLOAT, min: 0.001, max: 1000, precision: 3, significand: 20 }
          }
        ]
      } |
      {
        s: { value: 2, name: "Main Methods", type: DataType.INT, min: 1, max: 3, bits: 2 },
        v: 
        [
          {
            ["MainMethodEnum"]: { value: number, name: "MainMethodEnum", type: DataType.ENUM, max: 5, bits: 3 },
            ["MethodScale"]: { value: number, name: "MethodScale", type: DataType.FLOAT, min: 0.001, max: 1000, precision: 3, significand: 20 }
          },
          {
            ["MainMethodEnum"]: { value: number, name: "MainMethodEnum", type: DataType.ENUM, max: 5, bits: 3 },
            ["MethodScale"]: { value: number, name: "MethodScale", type: DataType.FLOAT, min: 0.001, max: 1000, precision: 3, significand: 20 }
          },
          {
            ["MainMethodEnum"]: { value: number, name: "MainMethodEnum", type: DataType.ENUM, max: 5, bits: 3 },
            ["MethodScale"]: { value: number, name: "MethodScale", type: DataType.FLOAT, min: 0.001, max: 1000, precision: 3, significand: 20 }
          }
        ]
      },
    ["PostProcessing Methods"]:   {
        s: { value: true, name: "PostProcessing Methods", type: DataType.BOOLEAN },
        v: 
        {
        
        }
      } | 
        {
        s: { value: false, name: "PostProcessing Methods", type: DataType.BOOLEAN },
        v: 
        {
          ["MethodEnumPost"]: { value: number, name: "MethodEnumPost", type: DataType.ENUM, max: 1, bits: 1 },
          ["MethodScale"]: { value: number, name: "MethodScale", type: DataType.FLOAT, min: 0.001, max: 1000, precision: 3, significand: 20 }
        }
      }
  },
  ["Shmuck"]: {
    ["Discrete Gradient"]: { value: boolean, name: "Discrete Gradient", type: DataType.BOOLEAN },
    ["Colour Count"]:   {
        s: { value: 2, name: "Colour Count", type: DataType.INT, min: 2, max: 10, bits: 4 },
        v: 
        [
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          }
        ]
      } |
      {
        s: { value: 3, name: "Colour Count", type: DataType.INT, min: 2, max: 10, bits: 4 },
        v: 
        [
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          }
        ]
      } |
      {
        s: { value: 4, name: "Colour Count", type: DataType.INT, min: 2, max: 10, bits: 4 },
        v: 
        [
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          }
        ]
      } |
      {
        s: { value: 5, name: "Colour Count", type: DataType.INT, min: 2, max: 10, bits: 4 },
        v: 
        [
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          }
        ]
      } |
      {
        s: { value: 6, name: "Colour Count", type: DataType.INT, min: 2, max: 10, bits: 4 },
        v: 
        [
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          }
        ]
      } |
      {
        s: { value: 7, name: "Colour Count", type: DataType.INT, min: 2, max: 10, bits: 4 },
        v: 
        [
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          }
        ]
      } |
      {
        s: { value: 8, name: "Colour Count", type: DataType.INT, min: 2, max: 10, bits: 4 },
        v: 
        [
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          }
        ]
      } |
      {
        s: { value: 9, name: "Colour Count", type: DataType.INT, min: 2, max: 10, bits: 4 },
        v: 
        [
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          },
          {
            ["R"]: { value: number, name: "R", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["G"]: { value: number, name: "G", type: DataType.INT, min: 0, max: 255, bits: 8 },
            ["B"]: { value: number, name: "B", type: DataType.INT, min: 0, max: 255, bits: 8 }
          }
        ]
      }
  }
}`;

test.only('testing type parsing of glslRayMarching', () =>
  expect(getStateDataTypeForSingleLevelContentTypeArray(verionArrayDefinition0)).toEqual(glslRayMarching_typeString));
