import { expect, test } from 'bun:test';
import { DataEntryFactory } from '../factory';
import { updateState } from '../update/enumOptionsUpdate';

// initialisation
test('init EnumOptions', () => {
  const intDE1 = DataEntryFactory.INT(0, 0, 1, '1');
  const intDE2 = DataEntryFactory.INT(1, 1, 2, '2');
  const object1 = DataEntryFactory.OBJECT([intDE1], 'intDE1-obj');
  const object2 = DataEntryFactory.OBJECT([intDE2], 'intDE2-obj');
  let dEO = DataEntryFactory.ENUM_OPTIONS([object1, object2], 0);
  const descriptor = JSON.parse(JSON.stringify(dEO.descriptor));
  expect(dEO.value!.value[0].value).toBe(0);
  expect(dEO.descriptor).toMatchObject(descriptor);
  dEO = updateState(dEO, 1, dEO.value);
  expect(dEO.value!.value[0].value).toBe(1);
  expect(dEO.descriptor).toMatchObject(descriptor);
  dEO = updateState(dEO, 0, dEO.value);
  expect(dEO.value!.value[0].value).toBe(1);
  expect(dEO.descriptor).toMatchObject(descriptor);
});
