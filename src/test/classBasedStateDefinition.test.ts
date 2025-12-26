import { expect, test } from 'bun:test';

import { DescriptorFactory } from '../factory/factory';
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
  const stateDescriptor = [node.toDataEntry() as any] as any;
  expect(FromState(stateDescriptor, 'state data object', node.getBase64String()).getBase64String()).toEqual(
    node.getBase64String()
  );
  expect(FromState(stateDescriptor, 'state data object', node.getBase64String()).toDataEntry().value[0]).toMatchObject(
    node.toDataEntry()
  );
  console.log(node.toString());
  console.log(FromState(stateDescriptor, 'state data object', node.getBase64String()).toString());
};

test('EnumOptionsDataEntry', () => {
  const enumA = DescriptorFactory.ENUM(2, 5, 'enum');
  const enumB = DescriptorFactory.ENUM(4, 25, 'enum');
  const enumOptions = DescriptorFactory.ENUM_OPTIONS([enumA, enumB, null]);
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

test('EnumOptionsDataEntry with ObjectDataEntries', () => {
  const enumA = DescriptorFactory.ENUM(2, 5, 'enumA');
  const enumB = DescriptorFactory.ENUM(4, 25, 'enumB');
  const enumC = DescriptorFactory.ENUM(3, 25, 'enumC');
  const obj0 = DescriptorFactory.OBJECT([enumA, enumB], 'obj');
  const obj1 = DescriptorFactory.OBJECT([enumA, enumB, enumC], 'obj');
  const obj2 = null;
  const enum0 = DescriptorFactory.ENUM_OPTIONS([obj0, obj1, obj2]);
  const enumOptions = DescriptorFactory.ENUM_OPTIONS([obj0, obj1, obj2, enum0]);
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
  ((enumOptionsNode.getChildren()[0] as ObjectNode).getChildren()[0] as EnumNode).updateValue(15);
  roundTrip(enumOptionsNode);
  enumOptionsNode.updateState(1);
  roundTrip(enumOptionsNode);
});

test('more complex state tree', () => {
  const enumA = DescriptorFactory.ENUM(0, 3, 'enumA');
  const enumB = DescriptorFactory.ENUM(0, 20, 'enumB');
  const int = DescriptorFactory.INT(0, 0, 100, 'int');
  const enumOptions = DescriptorFactory.ENUM_OPTIONS([enumA, enumB]);
  const array = DescriptorFactory.ARRAY(int, 3, 0, 100, 'array');
  const optional = DescriptorFactory.OPTIONAL([array, null], false, 'optional');
  const obj = DescriptorFactory.OBJECT([enumOptions, array, optional, enumOptions], 'obj');
  const objExample = DescriptorFactory.OBJECT([enumOptions, array, optional, obj], 'this object');
  const version = DescriptorFactory.VERSION(3, 4, 'versionA');

  const stateDescriptor = [version, obj, objExample, array];
  const stateNode = GetStateNodeTree(stateDescriptor as any, 'state data object');
  console.log(stateNode.toString());
  console.log(stateNode.getBase64String());
  console.log(FromState(stateDescriptor as any, 'state data object', stateNode.getBase64String()).toString());
  roundTrip(stateNode);
});

test('state node and ArrayDataEntry', () => {
  const int = DescriptorFactory.INT(0, 0, 100, 'int');
  const array = DescriptorFactory.ARRAY(int, 3, 1, 101, 'array');
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
