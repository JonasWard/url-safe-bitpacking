import { expect, test } from 'bun:test';
import { DataEntryFactory } from '../factory';
import { EnumOptionsDataEntry } from '../types';

test('nested data creation', () => {
  const charsHardCodedNumbers = '0123456789-.e'.split('');
  const charsSymbol = 'ABCDEFGHIJKLMNOPQRSTUVWXYZανβξΓγΔδΠπερζΣσςητΘΦφχλψμΩω0123456789?'.split('');
  const charsSubscript = 'abcdefghijklmnopqrstuvwxyz0123456789-_.,αβγεφμ+-()[]{}$*#~/<>!? '.split('');
  const charsName = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz 0123456789.'.split('');

  const hardcodedNumber = DataEntryFactory.ENUM_ARRAY([0], charsHardCodedNumbers, 1, 20, 'inlineInput');
  const symbol = DataEntryFactory.ENUM(0, charsSymbol, 'symbol');
  const subscriptValue = DataEntryFactory.ENUM(0, charsSubscript, 'subscriptValue');
  const name = DataEntryFactory.ENUM_ARRAY([21, 26, 37, 46, 30], charsName, 1, 20, 'name');

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
  inputDefinition.value = inputDefinition.value;
  inputDefinition.mapping = inputDefinition.mapping;

  const nameData = [symbol, subscriptValue, name] as const;

  const inputValueValue = DataEntryFactory.ENUM_OPTIONS([hardcodedInputObject, integerInputObject, floatInputObject]);

  const inputValueObject = DataEntryFactory.OBJECT([...nameData, inputValueValue]);

  const inputMethodObject = DataEntryFactory.OBJECT([...nameData, methodDescriptor]);

  const ModelStateDescriptor = [
    DataEntryFactory.VERSION(0, 8),
    DataEntryFactory.ARRAY(inputValueObject, 2, 0, 31, 'inputValues'),
    DataEntryFactory.ARRAY(inputMethodObject, 2, 0, 31, 'methodValues')
  ] as const;

  expect(true).toBe(true);
});
