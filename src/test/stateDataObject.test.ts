import { expect, test } from 'bun:test';

import { ComplexDataEntryFactory, DataEntryFactory } from '../factory/factory';
import { createStateDataObject, getInitialStateFromBase64 } from '../stateHandling';

test('stateDataobject - createStateDataObject - versionA', () => {
  createStateDataObject([DataEntryFactory.createVersion(3, 4, 'versionA', 0)], (s) => {
    console.log(s);
  });
});

const dataEntriesOnly = [
  DataEntryFactory.createVersion(3, 4, 'versionA', 0),
  DataEntryFactory.createInt(0, 0, 10, 'intA', 1),
  DataEntryFactory.createFloat(0.1, 0, 10, 1, 'floatA', 2),
  DataEntryFactory.createBoolean(true, 'boolA', 3),
  DataEntryFactory.createEnum(0, 3, 'enumA', 4),
  DataEntryFactory.createEnumArray([0, 1, 2], ['A', 'B', 'C'], 3, 5, 'enumArrayA', 5)
];

test('stateDataobject - createStateDataObject - data entries only', () => {
  createStateDataObject(dataEntriesOnly, (s) => {
    console.log(s);
  });
});

const dataEntriesWithComplex = [
  ...dataEntriesOnly,
  ComplexDataEntryFactory.createOptional(
    [[DataEntryFactory.createInt(0, 0, 10, 'intA', 1)], null],
    false,
    'optionalA',
    6
  ),
  ComplexDataEntryFactory.createEnumOptions(
    [
      [DataEntryFactory.createInt(0, 0, 10, 'intD_0', 1)],
      null,
      [DataEntryFactory.createInt(0, 0, 10, 'intD_2', 1)],
      [DataEntryFactory.createInt(0, 0, 10, 'intD_3', 1)]
    ],
    3,
    'enumOptionsA',
    7
  ),
  ComplexDataEntryFactory.createArray([DataEntryFactory.createInt(1, 0, 10, 'intA', 1)], 4, 3, 7, 'arrayA', 8)
];

test('stateDataobject - createStateDataObject - data entries complex', () => {
  const stateObject = createStateDataObject(dataEntriesWithComplex, (s) => console.log(s.bitstring));

  stateObject.state[8].updateValue({ ...stateObject.state[8], state: 5 });
  stateObject.state[8].value[4][0].updateValue({ ...stateObject.state[8].value[4][0], value: 5 });
  const base64 = stateObject.base64;
  const initialState = getInitialStateFromBase64(base64, dataEntriesWithComplex);
  createStateDataObject(initialState, (s) => console.log(s.bitstring));
});
