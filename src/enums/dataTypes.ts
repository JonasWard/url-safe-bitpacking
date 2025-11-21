export const DataTypeValues = ['VERSION', 'BOOLEAN', 'ENUM', 'INT', 'FLOAT', 'ENUM_ARRAY'] as const;
export const ComplexDataValues = ['OPTIONAL', 'ENUM_OPTIONS', 'ARRAY'] as const;

export type DataType = (typeof DataTypeValues)[number];
export type ComplexDataType = (typeof ComplexDataValues)[number];
