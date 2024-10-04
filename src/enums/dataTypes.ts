export enum DataType {
  VERSION,
  BOOLEAN,
  ENUM,
  INT,
  FLOAT,
}

export const getDataTypeName = (type: DataType): string => {
  switch (type) {
    case DataType.VERSION:
      return 'VERSION';
    case DataType.BOOLEAN:
      return 'BOOLEAN';
    case DataType.ENUM:
      return 'ENUM';
    case DataType.INT:
      return 'INT';
    case DataType.FLOAT:
      return 'FLOAT';
  }
};
