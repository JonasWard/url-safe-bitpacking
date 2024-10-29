import { DataEntryArray, DataEntry } from '../types/dataEntry';
export declare const valueBitsParser: (bitString: string, mapData: DataEntry) => number | boolean;
export declare const dataBitsParser: (rawString: string, mapData: DataEntry) => DataEntry;
export declare const getBitsCount: (mapData: DataEntry) => number;
export declare const dataEntryBitstringParser: (bitstring: string, dataEntry: DataEntry) => [DataEntry, string];
/**
 * Method to convert a bitstring into an array of data entries
 * @param bitString bitstring to parse into bits and then data entries
 * @param mapDataArray Data descriptions to map the bits to data entries
 * @returns array of data entries
 */
export declare const dataBitsArrayParser: (bitString: string, mapDataArray: DataEntry[]) => DataEntryArray;
export declare const dataBitsStringifier: (data: DataEntry) => string;
export declare const dataEntryCorrecting: (dataEntry: DataEntry) => DataEntry;
export declare const parseBitsToBase64: (bits: string) => string;
export declare const parseBase64ToBits: (base64: string) => string;
/**
 * Method to convert an array of data entries into a base64 string
 * @param dataArray Data Entries to read to parse into bits and then a base64 string
 * @returns bitstring representation of the data entries
 */
export declare const dataArrayStringifier: (dataEntryArray: DataEntryArray) => string;
