import { expect, test } from 'bun:test';
import { DataEntryFactory } from '../factory';
import { DataEntry, EnumOptionsDataEntry, VersionDataEntry } from '../types';
import {
  ArrayNode,
  EnumArrayNode,
  EnumNode,
  EnumOptionsNode,
  GetStateNodeTree,
  IntNode,
  NodeFactory,
  ObjectNode
} from '../stateHandling/stateNode';
import { getStateData } from '../../dist';

const charsHardCodedNumbers = '0123456789-.e'.split('');
const charsSymbol = 'ABCDEFGHIJKLMNOPQRSTUVWXYZανβξΓγΔδΠπερζΣσςητΘΦφχλψμΩω0123456789?'.split('');
const charsSubscript = 'abcdefghijklmnopqrstuvwxyz0123456789-_.,αβγεφμ+-()[]{}$*#~/<>!? '.split('');
const charsName = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz 0123456789.'.split('');

const hardcodedNumber = DataEntryFactory.ENUM_ARRAY([0], charsHardCodedNumbers, 1, 20, 'inlineInput');
const symbol = DataEntryFactory.ENUM(0, charsSymbol, 'symbol');
const subscriptValue = DataEntryFactory.ENUM(0, charsSubscript, 'subscriptValue');
const name = DataEntryFactory.ENUM_ARRAY([21, 26, 37, 46, 30], charsName, 1, 20, 'name');

test('nested data creation', () => {
  const hardcodedInputObject = DataEntryFactory.OBJECT([hardcodedNumber], 'hardcodedNumber');

  const inputDefinition: EnumOptionsDataEntry = {
    type: 'ENUM_OPTIONS',
    state: 0,
    stateBits: 3,
    descriptor: [hardcodedInputObject],
    value: hardcodedInputObject,
    mapping: ['hardcodedNumber'],
    name: 'inputDefinition'
  };

  const integerValue = DataEntryFactory.INT(0, -512, 511, 'integerValue');
  const integerMin = DataEntryFactory.INT(0, -512, 511, 'integerMin');
  const integerMax = DataEntryFactory.INT(100, -512, 511, 'integerMax');

  const integerInputObject = DataEntryFactory.OBJECT([integerValue, integerMin, integerMax], 'integer');

  const floatValue = DataEntryFactory.FLOAT(0, -5242.88, 5242.87, 2, 'floatValue');
  const floatMin = DataEntryFactory.FLOAT(0, -5242.88, 5242.87, 2, 'floatMin');
  const floatMax = DataEntryFactory.FLOAT(1, -5242.88, 5242.87, 2, 'floatMax');

  const floatInputObject = DataEntryFactory.OBJECT([floatValue, floatMin, floatMax], 'float');

  const valuesPair = DataEntryFactory.ARRAY(inputDefinition, 2, 2, 2, 'values');
  const valuesExtended = DataEntryFactory.ARRAY(inputDefinition, 1, 1, 8, 'values');

  const addition = DataEntryFactory.OBJECT([valuesExtended], 'addition');
  const multiplication = DataEntryFactory.OBJECT([valuesExtended], 'multiplication');

  const subtraction = DataEntryFactory.OBJECT([valuesPair], 'subtraction');
  const division = DataEntryFactory.OBJECT([valuesPair], 'division');
  const power = DataEntryFactory.OBJECT([valuesPair], 'power');

  const availableMethods = [addition, multiplication, subtraction, division, power];
  const methodDescriptor = DataEntryFactory.ENUM_OPTIONS(availableMethods, 0, 'method');

  const numericInput = DataEntryFactory.INT(0, 0, 31, 'numericInput');
  const methodOutput = DataEntryFactory.INT(0, 0, 31, 'methodOutput');

  DataEntryFactory.OBJECT([methodDescriptor], 'method');

  // reinitializing an inputDefinition object
  const iDB = DataEntryFactory.ENUM_OPTIONS(
    [
      hardcodedInputObject,
      DataEntryFactory.OBJECT([numericInput], 'numericInput'),
      DataEntryFactory.OBJECT([methodOutput], 'methodOutput'),
      DataEntryFactory.OBJECT([methodDescriptor], 'method')
    ],
    inputDefinition.state,
    inputDefinition.name
  );
  inputDefinition.descriptor = iDB.descriptor;
  inputDefinition.stateBits = iDB.stateBits;
  inputDefinition.value = iDB.value;
  inputDefinition.mapping = iDB.mapping;

  const nameData = [symbol, subscriptValue, name] as const;

  const inputValueValue = DataEntryFactory.ENUM_OPTIONS([hardcodedInputObject, integerInputObject, floatInputObject]);

  const inputValueObject = DataEntryFactory.OBJECT([...nameData, inputValueValue]);

  const inputMethodObject = DataEntryFactory.OBJECT([...nameData, methodDescriptor]);

  const ModelStateDescriptor = [
    DataEntryFactory.VERSION(0, 8),
    DataEntryFactory.ARRAY(inputValueObject, 2, 0, 31, 'inputValues'),
    DataEntryFactory.ARRAY(inputMethodObject, 2, 0, 31, 'methodValues')
  ] as [VersionDataEntry, ...DataEntry[]];

  const node = GetStateNodeTree(ModelStateDescriptor);

  expect(true).toBe(true);
});

test('int in array state update method', () => {
  const numericInput = DataEntryFactory.INT(5, 0, 31, 'numericInput');
  const arrayDefinition = DataEntryFactory.ARRAY(numericInput, 3, 0, 15);
  const arrayNode = NodeFactory(arrayDefinition, null);
  const c = arrayNode.getChildren() as IntNode[];

  c[0].updateValue(30);
  c[1].updateValue(2);
  expect(c.map((v) => v.value)).toMatchObject([30, 2, 5]);
  arrayNode.updateState(2);
  const cUpdate = arrayNode.getChildren() as IntNode[];
  expect(cUpdate.map((v) => v.value)).toMatchObject([30, 2]);
});

test('enum options in array state update method', () => {
  const numericInput = DataEntryFactory.INT(5, 0, 31, 'numericInput');
  const objectDefinition = DataEntryFactory.OBJECT([numericInput], 'objectDefinition');
  const enumOptionDefintion = DataEntryFactory.ENUM_OPTIONS([objectDefinition, null], 0, 'enumOptionDefintion');
  const arrayDefinition = DataEntryFactory.ARRAY(enumOptionDefintion, 3, 0, 15);
  const arrayNode = NodeFactory(arrayDefinition, null);
  const c = (arrayNode.getChildren() as EnumOptionsNode[]).map((e) => e.getChildData()![0] as IntNode);

  const getValuesFromStateData = (
    vs: {
      numericInput: number;
      state: 'objectDefinition';
    }[]
  ): number[] => vs.map((v) => v.numericInput);

  c[0].updateValue(30);
  c[1].updateValue(2);
  expect(getValuesFromStateData(getStateData(arrayNode.toDataEntry()) as any)).toMatchObject([30, 2, 5]);
  arrayNode.updateState(4);
  expect(getValuesFromStateData(getStateData(arrayNode.toDataEntry()) as any)).toMatchObject([30, 2, 5, 5]);
  arrayNode.updateState(2);
  expect(getValuesFromStateData(getStateData(arrayNode.toDataEntry()) as any)).toMatchObject([30, 2]);
});

test('array in enum options in object state update method', () => {
  const numericInput = DataEntryFactory.INT(5, 0, 31, 'numericInput');
  const arrayDefinition = DataEntryFactory.ARRAY(numericInput, 3, 0, 15, 'arrayLayer');
  const arrayInEnumOption = DataEntryFactory.OBJECT([arrayDefinition], 'arrayInEnumOption');
  const arrayInEnumOptionBis = DataEntryFactory.OBJECT([arrayDefinition], 'arrayInEnumOptionBis');
  const enumOptionDefintion = DataEntryFactory.ENUM_OPTIONS(
    [arrayInEnumOption, arrayInEnumOptionBis, null],
    0,
    'enumOptionDefintion'
  );
  const objectDefinition = DataEntryFactory.OBJECT([enumOptionDefintion], 'objectDef');
  const objectDefinitionNode = NodeFactory(objectDefinition, null);

  const getValuesFromStateData = (vs: { enumOptionDefintion: { arrayLayer: number[]; state: string } }): number[] =>
    vs.enumOptionDefintion.arrayLayer;

  const arrayEntries = (
    (objectDefinitionNode.getChildren()[0] as EnumOptionsNode).getChildData()![0] as ArrayNode
  ).getChildren() as IntNode[];

  arrayEntries[0].updateValue(30);
  arrayEntries[1].updateValue(2);

  expect(getValuesFromStateData(getStateData(objectDefinitionNode.toDataEntry()) as any)).toMatchObject([30, 2, 5]);
  ((objectDefinitionNode.getChildren()[0] as EnumOptionsNode).getChildData()![0] as ArrayNode).updateState(4);
  expect(getValuesFromStateData(getStateData(objectDefinitionNode.toDataEntry()) as any)).toMatchObject([30, 2, 5, 5]);
  ((objectDefinitionNode.getChildren()[0] as EnumOptionsNode).getChildData()![0] as ArrayNode).updateState(2);
  expect(getValuesFromStateData(getStateData(objectDefinitionNode.toDataEntry()) as any)).toMatchObject([30, 2]);
  ((objectDefinitionNode.getChildren()[0] as EnumOptionsNode).getChildData()![0] as ArrayNode).updateState(3);
  expect(getValuesFromStateData(getStateData(objectDefinitionNode.toDataEntry()) as any)).toMatchObject([30, 2, 5]);

  // this forgets the previous set values
  (objectDefinitionNode.getChildren()[0] as EnumOptionsNode).updateState(1);
  expect(getValuesFromStateData(getStateData(objectDefinitionNode.toDataEntry()) as any)).toMatchObject([30, 2, 5]);
});

test('inputMethodChanges - similar ArrayEntry definitions', () => {
  const hardcodedInputObject = DataEntryFactory.OBJECT([hardcodedNumber], 'hardcodedNumber');

  const inputDefinition: EnumOptionsDataEntry = {
    type: 'ENUM_OPTIONS',
    state: 0,
    stateBits: 3,
    descriptor: [hardcodedInputObject],
    value: hardcodedInputObject,
    mapping: ['hardcodedNumber'],
    name: 'inputDefinition'
  };

  const numericInput = DataEntryFactory.INT(0, 0, 31, 'numericInput');
  const methodOutput = DataEntryFactory.INT(0, 0, 31, 'methodOutput');

  const nameData = [symbol, subscriptValue, name] as const;

  const valuesPair = DataEntryFactory.ARRAY(inputDefinition, 2, 2, 2, 'values');
  const valuesExtended = DataEntryFactory.ARRAY(inputDefinition, 1, 1, 8, 'values');

  const addition = DataEntryFactory.OBJECT([valuesExtended], 'addition');
  const multiplication = DataEntryFactory.OBJECT([valuesExtended], 'multiplication');

  const subtraction = DataEntryFactory.OBJECT([valuesPair], 'subtraction');
  const division = DataEntryFactory.OBJECT([valuesPair], 'division');
  const power = DataEntryFactory.OBJECT([valuesPair], 'power');

  const availableMethods = [addition, multiplication, subtraction, division, power];
  const methodDescriptor = DataEntryFactory.ENUM_OPTIONS(availableMethods, 0, 'method');

  // reinitializing an inputDefinition object
  const iDB = DataEntryFactory.ENUM_OPTIONS(
    [
      hardcodedInputObject,
      DataEntryFactory.OBJECT([numericInput], 'numericInput'),
      DataEntryFactory.OBJECT([methodOutput], 'methodOutput'),
      DataEntryFactory.OBJECT([methodDescriptor], 'method')
    ],
    inputDefinition.state,
    inputDefinition.name
  );
  inputDefinition.descriptor = iDB.descriptor;
  inputDefinition.stateBits = iDB.stateBits;
  inputDefinition.value = iDB.value;
  inputDefinition.mapping = iDB.mapping;

  const inputMethodObject = DataEntryFactory.OBJECT([...nameData, methodDescriptor]);

  const methodArray = NodeFactory(DataEntryFactory.ARRAY(inputMethodObject, 2, 0, 31, 'methodValues'), null);

  const c0 = methodArray.getChildren()[0].getChildren();
  const [s, sub, n, content] = methodArray.getChildren()[0].getChildren() as [
    EnumNode,
    EnumNode,
    EnumArrayNode,
    EnumOptionsNode
  ];

  expect(content.getChildren().length).toEqual(1);
  const arrayNode = content.getChildData()![0] as ArrayNode;
  arrayNode.updateState(2);
  expect(arrayNode.state).toEqual(2);

  const values = content.getChildData()![0] as ArrayNode;
  const v0 = values.getChildren()[0] as EnumOptionsNode;
  v0.updateState(1);

  const v0beforeUpdate = (content.getChildData()![0] as ArrayNode).getChildren()[0] as EnumOptionsNode;
  content.updateState(2);
  const v0afterUpdate = (content.getChildData()![0] as ArrayNode).getChildren()[0] as EnumOptionsNode;

  expect(v0beforeUpdate.state).toEqual(1);
  expect(v0afterUpdate.state).toEqual(1);
});
