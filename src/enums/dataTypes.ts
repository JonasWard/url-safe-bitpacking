const DataTypeValues = ['VERSION', 'BOOLEAN', 'ENUM', 'INT', 'FLOAT', 'ENUM_ARRAY'] as const;

export type DataType = (typeof DataTypeValues)[number];
