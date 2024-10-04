import { DataType } from '../enums/dataTypes';
import { BooleanDataEntry } from '../types';

export const create = (value: boolean, name: string = '', index: number = -1): BooleanDataEntry => ({ value, type: DataType.BOOLEAN, name, index });
