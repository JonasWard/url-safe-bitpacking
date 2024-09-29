// src/enums/dataTypes.ts
var DataType;
(function(DataType2) {
  DataType2[DataType2["VERSION"] = 0] = "VERSION";
  DataType2[DataType2["BOOLEAN"] = 1] = "BOOLEAN";
  DataType2[DataType2["ENUM"] = 2] = "ENUM";
  DataType2[DataType2["INT"] = 3] = "INT";
  DataType2[DataType2["FLOAT"] = 4] = "FLOAT";
})(DataType || (DataType = {}));
// src/enums/objectGenerationTypes.ts
var ObjectGenerationOutputStatus;
(function(ObjectGenerationOutputStatus2) {
  ObjectGenerationOutputStatus2[ObjectGenerationOutputStatus2["DEFAULT"] = 0] = "DEFAULT";
  ObjectGenerationOutputStatus2[ObjectGenerationOutputStatus2["FROM_TYPE"] = 1] = "FROM_TYPE";
  ObjectGenerationOutputStatus2[ObjectGenerationOutputStatus2["PARSED"] = 2] = "PARSED";
  ObjectGenerationOutputStatus2[ObjectGenerationOutputStatus2["ERROR_PARSING"] = 3] = "ERROR_PARSING";
})(ObjectGenerationOutputStatus || (ObjectGenerationOutputStatus = {}));
// src/factory/intFactory.ts
var getBitsForIntegerNumber = (number) => Math.ceil(Math.log2(number));
var create = (min, max) => {
  if (!Number.isInteger(min) || !Number.isInteger(max))
    throw new Error("min and max must be integers");
  if (max - min < 1)
    throw new Error("max must be at least one");
  if (Math.abs(max - min) > 1023)
    throw new Error("max - min must be less than 1024");
  const bits = getBitsForIntegerNumber(max - min + 1);
  return { type: DataType.INT, min, max, bits };
};

// src/factory/floatFactory.ts
var create2 = (min, max, precision) => {
  const precisionMultiplier = 10 ** precision;
  const roundedMin = Math.floor(min * precisionMultiplier);
  const roundedMax = Math.ceil(max * precisionMultiplier);
  const delta = roundedMax - roundedMin;
  const significand = Math.max(1, getBitsForIntegerNumber(delta));
  return {
    type: DataType.FLOAT,
    min: roundedMin / precisionMultiplier,
    max: roundedMax / precisionMultiplier,
    precision,
    significand
  };
};

// src/factory/booleanFactory.ts
var create3 = () => ({ type: DataType.BOOLEAN });

// src/factory/versionFactory.ts
var create4 = (bits) => ({
  type: DataType.VERSION,
  bits
});

// src/factory/enumFactory.ts
var create5 = (max) => {
  if (!Number.isInteger(max))
    throw new Error("min and max must be integers");
  if (max < 1)
    throw new Error("max must be at least one");
  if (max > 1023)
    throw new Error("max - min must be less than 1024");
  const bits = getBitsForIntegerNumber(max + 1);
  return { type: DataType.ENUM, max, bits };
};

// src/factory/factory.ts
class DataRangeDescriptionFactory {
  static createFloat = create2;
  static createInt = create;
  static createEnum = create5;
  static createBoolean = create3;
  static createVersion = create4;
}

class DataDescriptionFactory {
  static createFloat = (min = 0, max = 1, precision = 2, name = "", index = 0) => ({
    ...create2(min, max, precision),
    name,
    index
  });
  static createInt = (min = 0, max = 10, name = "", index = 0) => ({
    ...create(min, max),
    name,
    index
  });
  static createEnum = (max = 10, name = "", index = 0) => ({
    ...create5(max),
    name,
    index
  });
  static createBoolean = (name = "", index = 0) => ({
    ...create3(),
    name,
    index
  });
  static createVersion = (bits = 8, name = "", index = 0) => ({
    ...create4(bits),
    name,
    index
  });
}

class DataEntryFactory {
  static createFloat = (value, min = 0, max = 1, precision = 2, name = "", index = 0) => ({
    ...create2(min, max, precision),
    value,
    name,
    index
  });
  static createInt = (value, min = 0, max = 10, name = "", index = 0) => ({
    ...create(min, max),
    value,
    name,
    index
  });
  static createEnum = (value, max = 10, name = "", index = 0) => ({
    ...create5(max),
    value,
    name,
    index
  });
  static createBoolean = (value, name = "", index = 0) => ({
    ...create3(),
    value,
    name,
    index
  });
  static createVersion = (value, bits = 8, name = "", index = 0) => ({
    ...create4(bits),
    value,
    name,
    index
  });
}
// src/parsers/intParser.ts
var getBitsCount = (intData) => intData.bits;
var rawValueParser = (stateString, bitCount) => {
  if (stateString.length < bitCount)
    throw new Error(`To few bits for this int bit string (${stateString.length} instead of ${bitCount})`);
  if (stateString.length > bitCount)
    throw new Error(`To many bits for this int bit string (${stateString.length} instead of ${bitCount})`);
  const parsed = parseInt(stateString, 2);
  if (isNaN(parsed))
    throw new Error("Invalid int state string");
  return parsed;
};
var rawParser = (stateString, intData) => {
  const v = rawValueParser(stateString, intData.bits) + intData.min;
  if (v > intData.max)
    throw new Error("Value exceeds max");
  return v;
};
var rawIntStringifier = (value, bitCount) => {
  if (Number.isInteger(value) === false)
    throw new Error("Value is not an integer");
  return value.toString(2).padStart(bitCount, "0");
};
var rawStringifier = (value, intData) => {
  if (value < intData.min)
    throw new Error("Value is below min");
  if (value > intData.max)
    throw new Error("Value exceeds max");
  return rawIntStringifier(value - intData.min, intData.bits);
};

// src/parsers/floatParser.ts
var getBitsCount2 = (floatData) => floatData.significand;
var rawValueParser2 = (stateString, significandBits, precision) => {
  if (stateString.length < significandBits)
    throw new Error(`To few bits for this float bit string (${stateString.length} instead of ${significandBits})`);
  if (stateString.length > significandBits)
    throw new Error(`To many bits for this float bit string (${stateString.length} instead of ${significandBits})`);
  const significand = rawValueParser(stateString, significandBits);
  return significand * 10 ** -precision;
};
var rawParser2 = (stateString, floatData) => {
  const v = floatData.min + rawValueParser2(stateString, floatData.significand, floatData.precision);
  if (v > floatData.max)
    throw new Error("Float value exceeds max");
  return v;
};
var rawStringifier2 = (value, floatData) => rawIntStringifier(Math.round((value - floatData.min) * 10 ** floatData.precision), floatData.significand);

// src/parsers/enumParser.ts
var getBitsCount3 = (versionData) => versionData.bits;
var rawParser3 = (rawString, versionData) => rawValueParser(rawString, versionData.bits);
var rawStringifier3 = (value, versionData) => {
  if (value > versionData.max)
    throw new Error("Version exceeds max");
  return rawIntStringifier(value, versionData.bits);
};

// src/parsers/versionParser.ts
var getBitsCount4 = (versionData) => versionData.bits;
var rawParser4 = (rawString, versionData) => rawValueParser(rawString, versionData.bits);
var rawStringifier4 = (value, versionData) => {
  if (value > 2 ** versionData.bits - 1)
    throw new Error("Version exceeds max");
  return rawIntStringifier(value, versionData.bits);
};

// src/parsers/booleanParser.ts
var getBitsCount5 = () => 1;
var rawValueParser3 = (stateString) => {
  if (stateString === "1")
    return true;
  if (stateString === "0")
    return false;
  throw new Error("Invalid boolean bit string");
};
var rawParser5 = (stateString) => rawValueParser3(stateString);
var rawStringifier5 = (value) => value ? "1" : "0";

// src/parsers/parsers.ts
var valueBitsParser = (bitString, mapData) => {
  switch (mapData.type) {
    case DataType.BOOLEAN:
      return rawParser5(bitString);
    case DataType.INT:
      return rawParser(bitString, mapData);
    case DataType.ENUM:
      return rawParser3(bitString, mapData);
    case DataType.FLOAT:
      return rawParser2(bitString, mapData);
    case DataType.VERSION:
      return rawParser4(bitString, mapData);
  }
};
var dataBitsParser = (rawString, mapData) => {
  switch (mapData.type) {
    case DataType.BOOLEAN:
      return { ...mapData, value: valueBitsParser(rawString, mapData) };
    case DataType.ENUM:
    case DataType.INT:
    case DataType.FLOAT:
    case DataType.VERSION:
      return { ...mapData, value: valueBitsParser(rawString, mapData) };
  }
};
var getBitsCount6 = (mapData) => {
  switch (mapData.type) {
    case DataType.BOOLEAN:
      return getBitsCount5();
    case DataType.INT:
      return getBitsCount(mapData);
    case DataType.FLOAT:
      return getBitsCount2(mapData);
    case DataType.VERSION:
      return getBitsCount4(mapData);
    case DataType.ENUM:
      return getBitsCount3(mapData);
  }
};
var dataBitsArrayParser = (bitString, mapDataArray) => {
  const bitCounts = mapDataArray.map((mapData) => getBitsCount6(mapData));
  const bitStartEndMap = [];
  bitCounts.forEach((bitCount, index) => {
    const start = index === 0 ? 0 : bitStartEndMap[index - 1][1];
    bitStartEndMap.push([start, start + bitCount]);
  });
  return mapDataArray.map((mapData, i) => dataBitsParser(bitString.slice(bitStartEndMap[i][0], bitStartEndMap[i][1]), mapData));
};
var dataBitsStringifier = (data) => {
  switch (data.type) {
    case DataType.BOOLEAN:
      return rawStringifier5(data.value);
    case DataType.INT:
      return rawStringifier(data.value, data);
    case DataType.FLOAT:
      return rawStringifier2(data.value, data);
    case DataType.VERSION:
      return rawStringifier4(data.value, data);
    case DataType.ENUM:
      return rawStringifier3(data.value, data);
  }
};
var dataEntryCorrecting = (dataEntry) => dataBitsParser(dataBitsStringifier(dataEntry), dataEntry);
var base64url = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
var parseBitsToBase64 = (bits) => {
  const chunks = bits.match(/.{1,6}/g);
  const numbers = chunks?.map((c) => Number.parseInt(c.padEnd(6, "0"), 2)) ?? [];
  return numbers.map((n) => base64url.charAt(n)).join("");
};
var parseBase64ToBits = (base64) => {
  const numbers = base64.split("").map((c) => base64url.indexOf(c));
  const chunks = numbers.map((n) => n.toString(2).padStart(6, "0"));
  return chunks.join("");
};
var dataArrayStringifier = (dataEntryArray) => {
  return dataEntryArray.map(dataBitsStringifier).join("");
};

// src/objectmap/versionReading.ts
var parameterOffset = 100;
var getVariableStrings = (definitionArrayObject) => {
  const keys = [];
  definitionArrayObject.forEach((value) => {
    if (Array.isArray(value)) {
      if (value.length === 2)
        keys.push(...getVariableStrings(value[1]));
      if (value.length === 3)
        keys.push(value[1].name);
    }
  });
  return keys;
};
var nestedDataEntryArrayToObject = (definitionArrayObject, startIndex) => {
  const baseIndex = startIndex * parameterOffset;
  return Object.fromEntries(definitionArrayObject.map((value, i) => {
    if (Array.isArray(value)) {
      if (value.length === 2)
        return [value[0], nestedDataEntryArrayToObject(value[1], baseIndex + i)];
      else
        return [value[0], nestedDataEntryArrayToObject(value[2](value[1]), baseIndex + i)];
    }
    return [value.name, { ...value, index: baseIndex + i }];
  }));
};
var definitionArrayObjectParser = (bitString, v, orderIndex) => {
  const [key, values] = v;
  const [nestedSemanticObject, objectGenerationStatus, localEndIndex] = parsingDefinitionArrayObject(bitString, values, orderIndex);
  return [[key, nestedSemanticObject], objectGenerationStatus, localEndIndex];
};
var methodParser = (bitString, v, orderIndex) => {
  const [key, keyDataDescription, methodGenerator] = v;
  const [keyDataEntry, status, bitWidth] = dataEntryParser(bitString, keyDataDescription, orderIndex);
  const [result, localStatus, localEndIndex] = definitionArrayObjectParser(bitString, [key, methodGenerator(keyDataEntry)], orderIndex);
  return [result, localStatus !== ObjectGenerationOutputStatus.PARSED ? localStatus : status, localEndIndex];
};
var dataEntryParser = (bitString, v, baseOrderIndex) => {
  const bitWidth = getBitsCount6(v);
  const value = dataBitsParser(bitString.slice(0, bitWidth), v);
  return [{ ...value, index: baseOrderIndex }, ObjectGenerationOutputStatus.PARSED, bitWidth];
};
var parsingDefinitionArrayObject = (bitString, definitionArrayObject, orderIndex) => {
  const baseOrderIndex = orderIndex * parameterOffset;
  let startIndex = 0;
  let objectGenerationStatus = ObjectGenerationOutputStatus.PARSED;
  return [
    Object.fromEntries(definitionArrayObject.map((value, i) => {
      if (Array.isArray(value)) {
        if (value.length === 2) {
          const [[key, nestedSemanticObject], status, localEndIndex] = definitionArrayObjectParser(bitString.slice(startIndex), value, baseOrderIndex + i);
          startIndex += localEndIndex;
          ObjectGenerationOutputStatus.PARSED;
          return [key, nestedSemanticObject];
        } else {
          const [[key, nestedSemanticObject], status, localEndIndex] = methodParser(bitString.slice(startIndex), value, baseOrderIndex + i);
          startIndex += localEndIndex;
          ObjectGenerationOutputStatus.PARSED;
          return [key, nestedSemanticObject];
        }
      } else {
        const [dataEntry, status, localEndIndex] = dataEntryParser(bitString.slice(startIndex), value, baseOrderIndex + i);
        startIndex += localEndIndex;
        ObjectGenerationOutputStatus.PARSED;
        return [dataEntry.name, dataEntry];
      }
    })),
    objectGenerationStatus,
    startIndex
  ];
};
var readingVersion = (bitstring) => dataBitsArrayParser(bitstring, [DataDescriptionFactory.createVersion(8)])[0];
var parseUrlMethod = (url, parserVersions) => {
  const bitString = parseBase64ToBits(url);
  const version = readingVersion(bitString);
  const versionParser = parserVersions[version.value];
  if (!versionParser)
    throw new Error(`No parser for version ${version.value}`);
  return parsingDefinitionArrayObject(bitString, versionParser.objectGeneratorParameters, 0)[0];
};
var parseDownNestedDataDescription = (nestedDataDescription) => {
  const dataDescriptions = [];
  Object.values(nestedDataDescription).forEach((value) => {
    if (value.hasOwnProperty("type"))
      dataDescriptions.push(value);
    else
      dataDescriptions.push(...parseDownNestedDataDescription(value));
  });
  return dataDescriptions.sort();
};
var getURLForData = (data) => {
  const dataEntryArray = parseDownNestedDataDescription(data);
  const bitstring = dataArrayStringifier(dataEntryArray);
  return parseBitsToBase64(bitstring);
};
var getTestStringValues = (data) => {
  const dataEntryArray = parseDownNestedDataDescription(data);
  const bitstring = dataArrayStringifier(dataEntryArray);
  const url = parseBitsToBase64(bitstring);
  const dataValueStrings = dataEntryArray.map((dataEntry) => dataBitsStringifier(dataEntry));
  const singleString = dataValueStrings.join("");
  const base64bitStringArray = singleString.match(/.{1,6}/g)?.map((c) => c.padEnd(6, "0")) ?? [];
  const base64valueArray = url.split("").map((c) => c.padStart(6, "_"));
  const raw = JSON.stringify(parseDownNestedDataDescription(data), undefined, 1);
  return {
    bitsString: dataValueStrings.join("-"),
    base64BitString: base64bitStringArray.join("-"),
    base64SplitString: base64valueArray.join("-"),
    base64String: url,
    raw
  };
};
// src/update/floatUpdate.ts
var updateValue = (original, update) => {
  const value = Math.max(Math.min(update.value, original.max), original.min);
  return {
    ...original,
    value
  };
};

// src/update/intUpdate.ts
var updateValue2 = (original, update) => {
  const value = Math.max(Math.min(update.value, original.max), original.min);
  return {
    ...original,
    value
  };
};

// src/update/enumUpdate.ts
var updateValue3 = (original, update) => {
  const value = Math.min(original.max, update.value);
  return {
    ...original,
    value
  };
};

// src/update/versionUpdate.ts
var updateValue4 = (original, update) => {
  const value = Math.min(original.bits ** 2 - 1, update.value);
  return {
    ...original,
    value
  };
};

// src/update/booleanUpdate.ts
var updateValue5 = (original, update) => ({
  ...original,
  value: update.value
});

// src/update/updateValues.ts
var updateValue6 = (original, update) => {
  if (original.type !== update.type)
    throw new Error("Types do not match");
  switch (original.type) {
    case DataType.FLOAT:
      return updateValue(original, update);
    case DataType.INT:
      return updateValue2(original, update);
    case DataType.ENUM:
      return updateValue3(original, update);
    case DataType.VERSION:
      return updateValue4(original, update);
    case DataType.BOOLEAN:
      return updateValue5(original, update);
  }
};

// src/objectmap/versionUpdate.ts
var dataEntryUpdating = (dataEntry, dataEntryArray) => {
  const existingDataEntry = dataEntryArray.find((d) => d.name === dataEntry.name);
  if (!existingDataEntry)
    return [dataEntry.name, dataEntry];
  return [dataEntry.name, updateValue6(dataEntry, existingDataEntry)];
};
var nestedDataEntryArrayUpdating = (definitionNestedArrray, dataEntryArray) => {
  const [keyString, nestedDefinitionArray] = definitionNestedArrray;
  return [keyString, updateDataEntryObject(nestedDefinitionArray, dataEntryArray)];
};
var generationObjectUpdating = (definitionArrayObject, dataEntryArray) => {
  const [keyString, keyDataEntry, methodGenerator] = definitionArrayObject;
  const foundKeyDataEntry = dataEntryArray.find((d) => d.name === keyDataEntry.name);
  const newKeyData = foundKeyDataEntry ? updateValue6(keyDataEntry, foundKeyDataEntry) : keyDataEntry;
  return [keyString, updateDataEntryObject(methodGenerator(newKeyData), dataEntryArray)];
};
var updateDataEntryObject = (definitionArrayObject, dataArray) => {
  const newNestedObject = {};
  definitionArrayObject.forEach((value) => {
    if (Array.isArray(value)) {
      if (value.length === 2) {
        const [keyString, nestedDataEntry] = nestedDataEntryArrayUpdating(value, dataArray);
        newNestedObject[keyString] = nestedDataEntry;
      } else {
        const [keyString, nestedDataEntry] = generationObjectUpdating(value, dataArray);
        newNestedObject[keyString] = nestedDataEntry;
      }
    } else {
      const [key, dataEntry] = dataEntryUpdating(value, dataArray);
      newNestedObject[key] = dataEntry;
    }
  });
  return newNestedObject;
};
var getDefaultObject = (versionObjects, versionindex) => {
  const versionParser = versionObjects[versionindex];
  if (!versionParser)
    throw new Error(`No parser for version ${versionindex} index`);
  return nestedDataEntryArrayToObject(versionParser.objectGeneratorParameters, 0);
};
var updateDataEntry = (data, newDataEntry, versionObjects) => {
  const version = data.version;
  const versionParser = versionObjects[version.value];
  if (!versionParser)
    throw new Error(`No parser for version ${version.value}`);
  const correctedDataEntry = dataEntryCorrecting(newDataEntry);
  const dataEntryArray = parseDownNestedDataDescription(data);
  const virginDataEntryArray = [correctedDataEntry, ...dataEntryArray];
  return updateDataEntryObject(versionParser.objectGeneratorParameters, virginDataEntryArray);
};
// src/utils/interpolateData.ts
var interpolateEntryAt = (dataEntry2, t) => {
  const localT = Math.max(Math.min(1, t), 0);
  const cosT = Math.cos(localT * 2 * Math.PI) * 0.5 + 0.5;
  switch (dataEntry2.type) {
    case DataType.BOOLEAN:
      return { ...dataEntry2, value: Boolean(Math.round(localT)) };
    case DataType.VERSION:
      return { ...dataEntry2, value: Math.floor(localT * (dataEntry2.bits ** 2 - 0.001)) };
    case DataType.ENUM:
      return { ...dataEntry2, value: Math.floor(localT * (dataEntry2.max + 0.999)) };
    case DataType.INT:
      return { ...dataEntry2, value: dataEntry2.min + Math.floor(cosT * (dataEntry2.max - dataEntry2.min + 0.999)) };
    case DataType.FLOAT:
      const v = dataEntry2.min + cosT * (dataEntry2.max - dataEntry2.min);
      return dataEntryCorrecting({ ...dataEntry2, value: Math.min(dataEntry2.max, Math.max(v, dataEntry2.min)) });
  }
};
// src/utils/relativeValue.ts
var getRelativeValue = (dataEntry2) => {
  switch (dataEntry2.type) {
    case DataType.BOOLEAN:
      return Number(dataEntry2.value);
    case DataType.INT:
    case DataType.FLOAT:
      return (dataEntry2.value - dataEntry2.min) / (dataEntry2.max - dataEntry2.min);
    case DataType.VERSION:
      return dataEntry2.value / (2 ** dataEntry2.bits - 1);
    case DataType.ENUM:
      return dataEntry2.value / dataEntry2.max;
  }
};
export {
  valueBitsParser,
  updateValue6 as updateValue,
  updateDataEntryObject,
  updateDataEntry,
  parseUrlMethod,
  parseDownNestedDataDescription,
  parseBitsToBase64,
  parseBase64ToBits,
  nestedDataEntryArrayToObject,
  interpolateEntryAt,
  getVariableStrings,
  getURLForData,
  getTestStringValues,
  getRelativeValue,
  getDefaultObject,
  getBitsCount6 as getBitsCount,
  dataEntryCorrecting,
  dataBitsStringifier,
  dataBitsParser,
  dataBitsArrayParser,
  dataArrayStringifier,
  ObjectGenerationOutputStatus,
  DataType,
  DataRangeDescriptionFactory,
  DataEntryFactory,
  DataDescriptionFactory
};