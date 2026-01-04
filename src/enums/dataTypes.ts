// File defining the data types and all the union types
export const ConstantBitWidthDataTypes = ['VERSION', 'BOOLEAN', 'ENUM', 'INT', 'FLOAT'] as const;
export const VariableBitWidthDataTypes = ['ENUM_ARRAY', 'OPTIONAL', 'ENUM_OPTIONS', 'ARRAY', 'OBJECT'] as const;

export const HasMappingDataTypes = ['ENUM', 'ENUM_ARRAY', 'ENUM_OPTIONS'] as const;
export const HasStateBitsDataTypes = ['ENUM_ARRAY', 'OPTIONAL', 'ENUM_OPTIONS', 'ARRAY'] as const;

export const HasChildDataTypes = ['OPTIONAL', 'ENUM_OPTIONS'] as const; // child can be null
export const HasChildrenDataTypes = ['ARRAY', 'OBJECT'] as const;

export const HasNestedDataTypes = ['OPTIONAL', 'ENUM_OPTIONS', 'ARRAY', 'OBJECT'] as const;

export const ValueUpdateDataTypes = ['VERSION', 'BOOLEAN', 'ENUM', 'INT', 'FLOAT', 'ENUM_ARRAY'] as const;
export const StateUpdateDataTypes = ['OPTIONAL', 'ENUM_OPTIONS', 'ARRAY'] as const;

export type DataType = (typeof ConstantBitWidthDataTypes)[number] | (typeof VariableBitWidthDataTypes)[number];
