import { DataEntryFactory } from '../factory';
import { ArrayEntryDataType, OptionalEntryDataType, SingleLevelContentType } from '../types';

export enum AttributeNames {
  Version = 'version',
  Viewport = 'Viewport',
  Canvas = 'Canvas',
  CanvasFullScreen = 'Canvas Full Screen',
  CanvasWidth = 'Canvas Width',
  CanvasHeight = 'Canvas Height',
  Rotation = 'Rotation',
  WorldOrigin = 'Origin',
  WorldEulerAngles = 'Euler Angles',
  ZoomLevel = 'Zoom Level',
  MousePosition = 'Mouse Position',
  CenterCoordinate = 'Center Coordinate',
  PositionX = 'Position X',
  PositionY = 'Position Y',
  Methods = 'Methods',
  PreProcessingMethods = 'PreProcessing Methods',
  PostProcessingMethods = 'PostProcessing Methods',
  MainMethods = 'Main Methods',
  MethodEnumMain = 'MainMethodEnum',
  MethodEnumPost = 'MethodEnumPost',
  MethodEnumPre = 'MethodEnumPre',
  MethodScale = 'MethodScale',
  Shmuck = 'Shmuck',
  DiscreteGradient = 'Discrete Gradient',
  ColorCount = 'Colour Count',
  R = 'R',
  G = 'G',
  B = 'B',
  H = 'H',
  S = 'S',
  V = 'V',
  XSpacing = 'X Spacing',
  YSpacing = 'Y Spacing',
  X = 'X',
  Y = 'Y',
  Z = 'Z',
  Pitch = 'Pitch',
  Roll = 'Roll',
  Yaw = 'Yaw',
}

export enum MethodNames {
  Gyroid = 'Gyroid',
  SchwarzD = 'SchwarzD',
  SchwarzP = 'SchwarzP',
  Perlin = 'Perlin',
  Neovius = 'Neovius',
  Mandelbrot = 'Mandelbrot',
  Sin = 'Sine',
  Cos = 'Cosine',
  Complex = 'Complex',
  Modulus = 'Modulus',
  AlternatingMoldus = 'AlternatingMoldus',
  None = 'None',
}

export const mainMethods = [MethodNames.Gyroid, MethodNames.SchwarzD, MethodNames.SchwarzP, MethodNames.Perlin, MethodNames.Neovius, MethodNames.Mandelbrot];
export const preProcessingMethods = [MethodNames.Complex, MethodNames.Modulus, MethodNames.AlternatingMoldus];
export const postProcessingMethods = [MethodNames.Sin, MethodNames.Cos];

export const MainMethodLabels = mainMethods.map((value, index) => ({ value: index, label: value }));
export const PreProcessingMethodLabels = preProcessingMethods.map((value, index) => ({ value: index, label: value }));
export const PostProcessingMethodLabels = postProcessingMethods.map((value, index) => ({ value: index, label: value }));

const mainMethodVersionStack: ArrayEntryDataType = [
  [1, 3],
  [
    DataEntryFactory.createEnum(0, MainMethodLabels.length - 1, `${AttributeNames.MethodEnumMain}`),
    DataEntryFactory.createFloat(1, 0.001, 1000, 3, `${AttributeNames.MethodScale}`),
  ],
];
const preMethodStack: OptionalEntryDataType = [
  false,
  [],
  [
    DataEntryFactory.createEnum(0, PostProcessingMethodLabels.length - 1, `${AttributeNames.MethodEnumPre}`),
    DataEntryFactory.createFloat(1, 0.1, 100, 3, `${AttributeNames.XSpacing}`),
    DataEntryFactory.createFloat(1, 0.1, 100, 3, `${AttributeNames.YSpacing}`),
  ],
];
const postMethodStack: OptionalEntryDataType = [
  false,
  [],
  [
    DataEntryFactory.createEnum(0, PostProcessingMethodLabels.length - 1, `${AttributeNames.MethodEnumPost}`),
    DataEntryFactory.createFloat(1, 0.001, 1000, 3, `${AttributeNames.MethodScale}`),
  ],
];

const colorArray: ArrayEntryDataType = [
  [2, 10],
  [
    DataEntryFactory.createInt(255, 0, 255, AttributeNames.R),
    DataEntryFactory.createInt(0, 0, 255, AttributeNames.G),
    DataEntryFactory.createInt(0, 0, 255, AttributeNames.B),
  ],
];

export const verionArrayDefinition0: SingleLevelContentType[] = [
  [
    AttributeNames.Viewport,
    [
      [
        AttributeNames.CanvasFullScreen,
        [
          true,
          [DataEntryFactory.createInt(200, 200, 4200, AttributeNames.CanvasWidth), DataEntryFactory.createInt(200, 200, 4200, AttributeNames.CanvasHeight)],
          [],
        ],
      ],
      [
        AttributeNames.WorldOrigin,
        [
          DataEntryFactory.createFloat(1, -500, 500, 3, AttributeNames.X),
          DataEntryFactory.createFloat(1, -500, 500, 3, AttributeNames.Y),
          DataEntryFactory.createFloat(1, -500, 500, 3, AttributeNames.Z),
        ],
      ],
      [
        AttributeNames.WorldEulerAngles,
        [
          DataEntryFactory.createFloat(0, -180, 180, 1, AttributeNames.Pitch),
          DataEntryFactory.createFloat(0, -180, 180, 1, AttributeNames.Roll),
          DataEntryFactory.createFloat(0, -180, 180, 1, AttributeNames.Yaw),
        ],
      ],
      [
        AttributeNames.MousePosition,
        [
          DataEntryFactory.createFloat(0, 0, 360, 1, AttributeNames.Rotation),
          DataEntryFactory.createFloat(1, 0.001, 1000, 3, AttributeNames.ZoomLevel),
          [
            AttributeNames.CenterCoordinate,
            [DataEntryFactory.createFloat(0, -1, 1, 3, AttributeNames.PositionX), DataEntryFactory.createFloat(0, -1, 1, 3, AttributeNames.PositionY)],
          ],
        ],
      ],
    ],
  ],
  [
    AttributeNames.Methods,
    [
      [AttributeNames.PreProcessingMethods, preMethodStack],
      [AttributeNames.MainMethods, mainMethodVersionStack],
      [AttributeNames.PostProcessingMethods, postMethodStack],
    ],
  ],
  [AttributeNames.Shmuck, [DataEntryFactory.createBoolean(false, AttributeNames.DiscreteGradient), [AttributeNames.ColorCount, colorArray]]],
];
