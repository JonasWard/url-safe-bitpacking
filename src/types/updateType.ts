import { DataEntry } from './dataEntry';

export const ComplexDataTypes = ['ENUM_OPTIONS', 'OPTIONAL', 'ARRAY'] as const;
export const SimpleDataTypes = ['BOOLEAN', 'INT', 'ENUM', 'FLOAT', 'VERSION', 'ENUM_ARRAY', 'OBJECT'] as const;

export const NestedUpdateTypes = ['ENUM_OPTIONS', 'OPTIONAL', 'ARRAY', 'OBJECT'] as const;
export const SimpleUpdateTypes = ['BOOLEAN', 'INT', 'ENUM', 'FLOAT', 'VERSION', 'ENUM_ARRAY'] as const;

export type UpdateWithValidationTypes = DataEntry & { type: (typeof SimpleUpdateTypes)[number] };
export type UpdateWithValuesEntries = DataEntry & { type: (typeof SimpleDataTypes)[number] };
export type UpdateWithStateEntries = DataEntry & { type: (typeof ComplexDataTypes)[number] };

export type UpdateValue<T extends UpdateWithValuesEntries> = (entry: T, value: T['value']) => T;
export type UpdateState<T extends UpdateWithStateEntries> = (entry: T, state: T['state'], current?: T['value']) => T;
