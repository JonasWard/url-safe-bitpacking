import { expect, test } from 'bun:test';

import { DataEntryFactory } from '../factory/factory';
import {
  EnumNode,
  FromState,
  GetStateNodeTree,
  IntNode,
  NodeFactory,
  ObjectNode,
  SpecificTypeNode
} from '../stateHandling/stateNode';

const roundTrip = (node: SpecificTypeNode) => {
  const dEntry = node.toDataEntry();
  const stateDescriptor = [dEntry] as any;
  const base64 = node.getBase64String();
  // console.log(base64, FromState(stateDescriptor, 'state data object', base64).getBase64String());
  expect(FromState(stateDescriptor, 'state data object', base64).getBase64String()).toEqual(base64);
  expect(FromState(stateDescriptor, 'state data object', base64).toDataEntry().value[0]).toMatchObject(dEntry);
};

test('EnumOptionsDataEntry', () => {
  const enumA = DataEntryFactory.ENUM(2, 5, 'enum');
  const enumB = DataEntryFactory.ENUM(4, 25, 'enum');
  const enumOptions = DataEntryFactory.ENUM_OPTIONS([enumA, enumB, null]);
  const enumOptionsNode = NodeFactory(enumOptions, null);
  expect(enumOptionsNode.getChildren().length).toEqual(1);
  roundTrip(enumOptionsNode);
  enumOptionsNode.updateState(2);
  roundTrip(enumOptionsNode);
  expect(enumOptionsNode.getChildren()[0]).toEqual(null);
  enumOptionsNode.updateState(1);
  roundTrip(enumOptionsNode);
  expect((enumOptionsNode.getChildren()[0] as EnumNode).value).toEqual(4);
  enumOptionsNode.updateState(0);
  roundTrip(enumOptionsNode);
  expect((enumOptionsNode.getChildren()[0] as EnumNode).value).toEqual(4);
});

test('ObjectDataEntries', () => {
  const enumA = DataEntryFactory.ENUM(2, 5, 'enumA');
  const enumB = DataEntryFactory.ENUM(4, 25, 'enumB');
  const enumC = DataEntryFactory.ENUM(3, 25, 'enumC');
  const obj = DataEntryFactory.OBJECT([enumA, enumB, enumC], 'obj');
  const enumOptionsNode = NodeFactory(obj, null);
  roundTrip(enumOptionsNode);
  (enumOptionsNode.getChildren()[0] as EnumNode).updateValue(3);
  (enumOptionsNode.getChildren()[1] as EnumNode).updateValue(10);
  (enumOptionsNode.getChildren()[2] as EnumNode).updateValue(27);
  roundTrip(enumOptionsNode);
});

test('ObjectDataEntries', () => {
  const enumA = DataEntryFactory.ENUM(2, 5, 'enumA');
  const enumB = DataEntryFactory.ENUM(4, 25, 'enumB');
  const enumC = DataEntryFactory.ENUM(3, 25, 'enumC');
  const obj = DataEntryFactory.OBJECT([enumA, enumB, enumC], 'obj');
  const obj1 = DataEntryFactory.OBJECT([obj], 'obj1');
  const enumOptionsNode = NodeFactory(obj1, null);
  roundTrip(enumOptionsNode);
  ((enumOptionsNode.getChildren()[0] as ObjectNode).getChildren()[0] as EnumNode).updateValue(3);
  ((enumOptionsNode.getChildren()[0] as ObjectNode).getChildren()[1] as EnumNode).updateValue(10);
  ((enumOptionsNode.getChildren()[0] as ObjectNode).getChildren()[2] as EnumNode).updateValue(27);
  roundTrip(enumOptionsNode);
});

test('EnumOptionsDataEntry with ObjectDataEntries', () => {
  const enumA = DataEntryFactory.ENUM(2, 5, 'enumA');
  const enumB = DataEntryFactory.ENUM(4, 25, 'enumB');
  const enumC = DataEntryFactory.ENUM(3, 25, 'enumC');
  const obj0 = DataEntryFactory.OBJECT([enumA, enumB], 'obj');
  const obj1 = DataEntryFactory.OBJECT([enumA, enumB, enumC], 'obj');
  const obj2 = null;
  const enum0 = DataEntryFactory.ENUM_OPTIONS([obj0, obj1, obj2]);
  const enumOptions = DataEntryFactory.ENUM_OPTIONS([obj0, obj1, obj2, enum0]);
  const enumOptionsNode = NodeFactory(enumOptions, null);
  expect(enumOptionsNode.getChildren().length).toEqual(1);
  roundTrip(enumOptionsNode);
  enumOptionsNode.updateState(3);
  roundTrip(enumOptionsNode);
  expect((enumOptionsNode.getChildren()[0] as ObjectNode).getChildren().length).toEqual(1);
  enumOptionsNode.updateState(2);
  roundTrip(enumOptionsNode);
  expect(enumOptionsNode.getChildren()[0]).toEqual(null);
  enumOptionsNode.updateState(1);
  roundTrip(enumOptionsNode);
  expect((enumOptionsNode.getChildren()[0] as ObjectNode).getChildren().length).toEqual(3);
  enumOptionsNode.updateState(0);
  roundTrip(enumOptionsNode);
  expect((enumOptionsNode.getChildren()[0] as ObjectNode).getChildren().length).toEqual(2);
  ((enumOptionsNode.getChildren()[0] as ObjectNode).getChildren()[0] as EnumNode).updateValue(5);
  roundTrip(enumOptionsNode);
  enumOptionsNode.updateState(1);
  roundTrip(enumOptionsNode);
});

test('more complex state tree', () => {
  const enumA = DataEntryFactory.ENUM(0, 3, 'enumA');
  const enumB = DataEntryFactory.ENUM(0, 20, 'enumB');
  const int = DataEntryFactory.INT(0, 0, 100, 'int');
  const enumOptions = DataEntryFactory.ENUM_OPTIONS([enumA, enumB]);
  const array = DataEntryFactory.ARRAY(int, 3, 0, 100, 'array');
  const optional = DataEntryFactory.OPTIONAL([array, null], false, 'optional');
  const obj = DataEntryFactory.OBJECT([enumOptions, array, optional, enumOptions], 'obj');
  const objExample = DataEntryFactory.OBJECT([enumOptions, array, optional, obj], 'this object');
  const version = DataEntryFactory.VERSION(3, 4, 'versionA');

  const stateDescriptor = [version, obj, objExample, array];
  const stateNode = GetStateNodeTree(stateDescriptor as any, 'state data object');
  console.log(stateNode.toString());
  console.log(stateNode.getBase64String());
  console.log(FromState(stateDescriptor as any, 'state data object', stateNode.getBase64String()).toString());
  roundTrip(stateNode);
});

test('state node and ArrayDataEntry', () => {
  const int = DataEntryFactory.INT(0, 0, 100, 'int');
  const array = DataEntryFactory.ARRAY(int, 3, 1, 101, 'array');
  const arrayNode = NodeFactory(array, null);
  expect(arrayNode.getChildren().length).toEqual(3);
  expect(arrayNode.getChildren().map((n) => (n as IntNode).value)).toMatchObject([0, 0, 0]);
  (arrayNode.getChildren()[0] as IntNode).updateValue(3);
  expect(arrayNode.getChildren().map((n) => (n as IntNode).value)).toMatchObject([3, 0, 0]);
  (arrayNode.getChildren()[0] as IntNode).updateValue(8);
  expect(arrayNode.getChildren().map((n) => (n as IntNode).value)).toMatchObject([8, 0, 0]);
  arrayNode.updateState(4);
  expect(arrayNode.getChildren().length).toEqual(4);
  expect(arrayNode.getChildren().map((n) => (n as IntNode).value)).toMatchObject([8, 0, 0, 0]);
  (arrayNode.getChildren()[3] as IntNode).updateValue(99);
  expect(arrayNode.getChildren().map((n) => (n as IntNode).value)).toMatchObject([8, 0, 0, 99]);
  arrayNode.updateState(2);
  expect(arrayNode.getChildren().length).toEqual(2);
  expect(arrayNode.getChildren().map((n) => (n as IntNode).value)).toMatchObject([8, 0]);
  (arrayNode.getChildren()[1] as IntNode).updateValue(5);
  expect(arrayNode.getChildren().map((n) => (n as IntNode).value)).toMatchObject([8, 5]);
  arrayNode.updateState(3);
  expect(arrayNode.getChildren().length).toEqual(3);
  expect(arrayNode.getChildren().map((n) => (n as IntNode).value)).toMatchObject([8, 5, 0]);
  roundTrip(arrayNode);
  arrayNode.updateState(1);
  expect(arrayNode.getChildren().length).toEqual(1);
  roundTrip(arrayNode);
  arrayNode.updateState(10);
  expect(arrayNode.getChildren().length).toEqual(10);
  roundTrip(arrayNode);
  (arrayNode.getChildren()[7] as IntNode).updateValue(99);
  roundTrip(arrayNode);
});
