import { BooleanDescriptionWithValueType, IntDescriptionWithValueType, FloatDescriptionWithValueType, VersionDescriptionWithValueType, FloatDiscriptionType, BooleanDiscriptionType, VersionDiscriptionType, IntDiscriptionType, EnumDiscriptionType, EnumDescriptionWithValueType } from '../types/dataEntry';
import { PrecisionRangeType } from '../types/floatData';
import { VersionRangeType } from '../types/versionData';
export declare class DataRangeDescriptionFactory {
    static createFloat: (min: number, max: number, precision: PrecisionRangeType) => import("..").FloatData;
    static createInt: (min: number, max: number) => import("..").IntData;
    static createEnum: (max: number) => import("..").EnumData;
    static createBoolean: () => import("..").BooleanData;
    static createVersion: (bits: VersionRangeType) => import("..").VersionData;
}
export declare class DataDescriptionFactory {
    static createFloat: (min?: number, max?: number, precision?: PrecisionRangeType, name?: string, index?: number) => FloatDiscriptionType;
    static createInt: (min?: number, max?: number, name?: string, index?: number) => IntDiscriptionType;
    static createEnum: (max?: number, name?: string, index?: number) => EnumDiscriptionType;
    static createBoolean: (name?: string, index?: number) => BooleanDiscriptionType;
    static createVersion: (bits?: VersionRangeType, name?: string, index?: number) => VersionDiscriptionType;
}
export declare class DataEntryFactory {
    static createFloat: (value: number, min?: number, max?: number, precision?: PrecisionRangeType, name?: string, index?: number) => FloatDescriptionWithValueType;
    static createInt: (value: number, min?: number, max?: number, name?: string, index?: number) => IntDescriptionWithValueType;
    static createEnum: (value: number, max?: number, name?: string, index?: number) => EnumDescriptionWithValueType;
    static createBoolean: (value: boolean, name?: string, index?: number) => BooleanDescriptionWithValueType;
    static createVersion: (value: number, bits?: VersionRangeType, name?: string, index?: number) => VersionDescriptionWithValueType;
}
//# sourceMappingURL=factory.d.ts.map