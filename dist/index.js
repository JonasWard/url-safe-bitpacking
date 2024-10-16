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
// src/types/floatData.ts
var SignificandMaxBits = 20;

// src/factory/helperMethod.ts
var getBitsForIntegerNumber = (number, maxBits) => {
  const bitCount = Math.ceil(Math.log2(number));
  if (bitCount > maxBits)
    throw new Error(`Cannot get ${maxBits} bits for a number with ${bitCount} bits`);
  return bitCount;
};
var getMaxIntegerValueForGivenBitWidth = (bitCount) => 2 ** bitCount - 1;

// src/factory/floatFactory.ts
var create = (value, min = 0, max = 1, precision = 2, name = "", index = -1) => {
  const precisionMultiplier = 10 ** precision;
  const roundedMin = Math.floor(min * precisionMultiplier);
  const roundedMax = Math.ceil(max * precisionMultiplier);
  const delta = roundedMax - roundedMin;
  const significand = Math.max(1, getBitsForIntegerNumber(delta, SignificandMaxBits));
  return {
    value,
    type: DataType.FLOAT,
    min: roundedMin / precisionMultiplier,
    max: roundedMax / precisionMultiplier,
    precision,
    significand,
    name,
    index
  };
};

// src/types/intData.ts
var IntegerMaxBits = 12;

// src/factory/intFactory.ts
var create2 = (value, min = 0, max = 10, name = "", index = -1) => {
  if (!Number.isInteger(min) || !Number.isInteger(max))
    throw new Error("min and max must be integers");
  if (max - min < 1)
    throw new Error("max must be at least one");
  if (Math.abs(max - min) > 2 ** IntegerMaxBits - 1)
    throw new Error("max - min must be less than 1024");
  const bits = getBitsForIntegerNumber(max - min + 1, IntegerMaxBits);
  return { value, type: DataType.INT, min, max, bits, name, index };
};

// src/factory/booleanFactory.ts
var create3 = (value, name = "", index = -1) => ({ value, type: DataType.BOOLEAN, name, index });

// src/factory/versionFactory.ts
var create4 = (value, bits = 8, name = "", index = -1) => ({
  value,
  type: DataType.VERSION,
  bits,
  name,
  index
});

// src/types/enumData.ts
var EnumMaxBits = 8;

// src/factory/enumFactory.ts
var create5 = (value, max = 10, name = "", index = -1) => {
  if (!Number.isInteger(max))
    throw new Error("min and max must be integers");
  if (max < 1)
    throw new Error("max must be at least one");
  if (max > 2 ** EnumMaxBits - 1)
    throw new Error("max - min must be less than 256");
  const bits = getBitsForIntegerNumber(max + 1, EnumMaxBits);
  return { value, type: DataType.ENUM, max, bits, name, index };
};

// src/factory/factory.ts
var DataEntryFactory = {
  createFloat: create,
  createInt: create2,
  createEnum: create5,
  createBoolean: create3,
  createVersion: create4
};
// src/types/arrayDefinitions.ts
var NAME_DELIMETER = "_";

// src/objectmap/versionArrayDefinitionToObjectDefintion.ts
var isSingleLevelContentType = (data) => singleLevelContentTypeIsDataEntry(data[0]) || singleLevelContentTypeIsNestedContentDataType(data[0]);
var isDoubleLevelContentType = (data) => !isSingleLevelContentType(data);
var singleLevelContentTypeIsDataEntry = (data) => !Array.isArray(data) && typeof data === "object";
var singleLevelContentTypeIsNestedContentDataType = (data) => Array.isArray(data) && typeof data[0] === "string";
var singleLevelContentTypeIsEnumEntryDataType = (data) => isDoubleLevelContentType(data) && typeof data[0] === "number";
var singleLevelContentTypeIsOptionalEntryDataType = (data) => isDoubleLevelContentType(data) && typeof data[0] === "boolean";
var parseSingleLevelContentTypeToDefinitionSubObject = (data, internalPrecedingName) => {
  if (singleLevelContentTypeIsDataEntry(data))
    return parseDataEntry(data, internalPrecedingName);
  else if (singleLevelContentTypeIsNestedContentDataType(data))
    return parseNestedContentDataTypeToDefinitionNestedArray(data, internalPrecedingName);
  else {
    throw new Error("this is an invalid output value, wonder why?");
  }
};
var parseNestedContentDataTypeToDefinitionNestedArray = (data, internalPrecedingName) => {
  const [attributeName, localData] = data;
  if (isSingleLevelContentType(localData))
    return [attributeName, localData.map((v) => parseSingleLevelContentTypeToDefinitionSubObject(v, internalPrecedingName))];
  else if (singleLevelContentTypeIsEnumEntryDataType(localData))
    return parseEnumEntryDataTypeToDefinitionNestedGenerationObject(localData, attributeName, internalPrecedingName);
  else if (singleLevelContentTypeIsOptionalEntryDataType(localData))
    return parseOptionalEntryDataTypeToDefinitionNestedGenerationObject(localData, attributeName, internalPrecedingName);
  else {
    throw new Error("this is an invalid output value, wonder why?");
  }
};
var parseEnumEntryDataTypeToDefinitionNestedGenerationObject = (data, name, internalPrecedingName) => {
  if (Math.round(data[0]) !== data[0])
    `given default (${data[0]}) value isn't an integer, rounding it`;
  if (data.length - 2 < Math.round(data[0]))
    console.log(`given default value (${data[0]}) was larger than the amount of options available, using the largest value (${data.length - 2}) instead`);
  if (data[0] < 0)
    console.log(`given default value (${data[0]}) was negative, using first index (0) instead`);
  const dataEntry = parseDataEntry(DataEntryFactory.createEnum(Math.max(Math.min(data.length - 2, Math.round(data[0])), 0), data.length - 2, name), internalPrecedingName);
  const generationMethod = (d) => [
    d,
    ...data[d.value + 1].map((v) => parseSingleLevelContentTypeToDefinitionSubObject(v, dataEntry.internalName))
  ];
  return [name, dataEntry, generationMethod];
};
var parseOptionalEntryDataTypeToDefinitionNestedGenerationObject = (data, name, internalPrecedingName) => {
  const dataEntry = parseDataEntry(DataEntryFactory.createBoolean(data[0], name), internalPrecedingName);
  const generationMethod = (d) => [
    d,
    ...data[Number(!d.value) + 1].map((v) => parseSingleLevelContentTypeToDefinitionSubObject(v, dataEntry.internalName))
  ];
  return [name, dataEntry, generationMethod];
};
var parseDataEntry = (d, internalPrecedingName) => internalPrecedingName ? { ...d, internalName: `${internalPrecedingName}${NAME_DELIMETER}${d.name}` } : d;
var parseVersionArrayDefinitionTypeToVersionDefinitionObject = (v, optionalIndexOverwrite) => [
  optionalIndexOverwrite ? { ...parseDataEntry(v[0]), value: optionalIndexOverwrite } : parseDataEntry(v[0]),
  ...v.slice(1).map((d) => parseSingleLevelContentTypeToDefinitionSubObject(d, "_"))
];

// src/parsers/intParser.ts
var getBitsCount = (intData2) => intData2.bits;
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
var rawParser = (stateString, intData2) => {
  const v = rawValueParser(stateString, intData2.bits) + intData2.min;
  if (v > intData2.max)
    throw new Error("Value exceeds max");
  return v;
};
var rawIntStringifier = (value, bitCount) => {
  if (Number.isInteger(value) === false)
    throw new Error("Value is not an integer");
  return value.toString(2).padStart(bitCount, "0");
};
var rawStringifier = (value, intData2) => {
  if (value < intData2.min)
    throw new Error("Value is below min");
  if (value > intData2.max)
    throw new Error("Value exceeds max");
  return rawIntStringifier(value - intData2.min, intData2.bits);
};

// src/parsers/floatParser.ts
var getBitsCount2 = (floatData2) => floatData2.significand;
var rawValueParser2 = (stateString, significandBits, precision) => {
  if (stateString.length < significandBits)
    throw new Error(`To few bits for this float bit string (${stateString.length} instead of ${significandBits})`);
  if (stateString.length > significandBits)
    throw new Error(`To many bits for this float bit string (${stateString.length} instead of ${significandBits})`);
  const significand = rawValueParser(stateString, significandBits);
  return significand * 10 ** -precision;
};
var rawParser2 = (stateString, floatData2) => {
  const v = floatData2.min + rawValueParser2(stateString, floatData2.significand, floatData2.precision);
  if (v > floatData2.max)
    throw new Error("Float value exceeds max");
  return v;
};
var rawStringifier2 = (value, floatData2) => rawIntStringifier(Math.round((value - floatData2.min) * 10 ** floatData2.precision), floatData2.significand);

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
var currentObjectIndex = -1;
var nestedDataEntryArrayToObject = (definitionArrayObject) => {
  currentObjectIndex = -1;
  return internalNestedDataEntryArrayToObject(definitionArrayObject);
};
var internalNestedDataEntryArrayToObject = (definitionArrayObject) => {
  return Object.fromEntries(definitionArrayObject.map((value) => {
    if (Array.isArray(value)) {
      if (value.length === 2)
        return [value[0], internalNestedDataEntryArrayToObject(value[1])];
      else
        return [value[0], internalNestedDataEntryArrayToObject(value[2](value[1]))];
    }
    return [value.name, { ...value, index: ++currentObjectIndex }];
  }));
};
var definitionArrayObjectParser = (bitString, v) => {
  const [key, values] = v;
  const [nestedSemanticObject, objectGenerationStatus, localEndIndex] = parsingDefinitionArrayObject(bitString, values);
  return [[key, nestedSemanticObject], objectGenerationStatus, localEndIndex];
};
var methodParser = (bitString, v) => {
  const [key, keyDataDescription, methodGenerator] = v;
  const [keyDataEntry, status] = dataEntryParser(bitString, keyDataDescription, false);
  const [result, localStatus, localEndIndex] = definitionArrayObjectParser(bitString, [key, methodGenerator(keyDataEntry)]);
  return [result, localStatus !== ObjectGenerationOutputStatus.PARSED ? localStatus : status, localEndIndex];
};
var dataEntryParser = (bitString, v, iterate = true) => {
  const bitWidth = getBitsCount6(v);
  const value = iterate ? { ...dataBitsParser(bitString.slice(0, bitWidth), v), index: ++currentObjectIndex } : dataBitsParser(bitString.slice(0, bitWidth), v);
  return [value, ObjectGenerationOutputStatus.PARSED, bitWidth];
};
var parsingDefinitionArrayObject = (bitString, definitionArrayObject) => {
  let startIndex = 0;
  let objectGenerationStatus = ObjectGenerationOutputStatus.PARSED;
  return [
    Object.fromEntries(definitionArrayObject.map((value) => {
      if (Array.isArray(value)) {
        if (value.length === 2) {
          const [[key, nestedSemanticObject], status, localEndIndex] = definitionArrayObjectParser(bitString.slice(startIndex), value);
          startIndex += localEndIndex;
          ObjectGenerationOutputStatus.PARSED;
          return [key, nestedSemanticObject];
        } else {
          const [[key, nestedSemanticObject], status, localEndIndex] = methodParser(bitString.slice(startIndex), value);
          startIndex += localEndIndex;
          ObjectGenerationOutputStatus.PARSED;
          return [key, nestedSemanticObject];
        }
      } else {
        const [dataEntry, status, localEndIndex] = dataEntryParser(bitString.slice(startIndex), value);
        startIndex += localEndIndex;
        ObjectGenerationOutputStatus.PARSED;
        return [dataEntry.name, dataEntry];
      }
    })),
    objectGenerationStatus,
    startIndex
  ];
};
var parseUrlMethod = (url, parserVersions) => {
  currentObjectIndex = -1;
  const bitString = parseBase64ToBits(url);
  const version = dataBitsArrayParser(bitString, [DataEntryFactory.createVersion(0, parserVersions.versionBitCount)])[0];
  const versionParser = parserVersions.parsers[version.value];
  if (!versionParser)
    throw new Error(`No parser for version ${version.value}`);
  return parsingDefinitionArrayObject(bitString, versionParser.objectGeneratorParameters)[0];
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
    case DataType.BOOLEAN:
      return updateValue5(original, update);
    case DataType.VERSION:
      return updateValue4(original, update);
  }
};

// src/objectmap/versionUpdate.ts
var currentObjectIndex2 = 0;
var findExistingDataEntry = (dataEntry, dataEntryArray) => {
  const dataEntryName = dataEntry.internalName ?? dataEntry.name;
  return dataEntryArray.find((d) => (d.internalName ?? d.name) === dataEntryName);
};
var dataEntryUpdating = (dataEntry, dataEntryArray) => {
  const existingDataEntry = findExistingDataEntry(dataEntry, dataEntryArray);
  if (!existingDataEntry)
    return [dataEntry.name, { ...dataEntry, index: currentObjectIndex2++ }];
  return [dataEntry.name, { ...updateValue6(dataEntry, existingDataEntry), index: currentObjectIndex2++ }];
};
var nestedDataEntryArrayUpdating = (definitionNestedArrray, dataEntryArray) => {
  const [keyString, nestedDefinitionArray] = definitionNestedArrray;
  return [keyString, updateDataEntryObject(nestedDefinitionArray, dataEntryArray)];
};
var generationObjectUpdating = (definitionArrayObject, dataEntryArray) => {
  const [keyString, keyDataEntry, methodGenerator] = definitionArrayObject;
  const foundKeyDataEntry = findExistingDataEntry(keyDataEntry, dataEntryArray);
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
var updateDataEntry = (data, newDataEntry, parsersForVersion) => {
  currentObjectIndex2 = 0;
  const version = data.version;
  const versionParser = parsersForVersion[version.value];
  if (!versionParser)
    throw new Error(`No parser for version ${version.value}`);
  const correctedDataEntry = dataEntryCorrecting(newDataEntry);
  const dataEntryArray = parseDownNestedDataDescription(data);
  const virginDataEntryArray = [correctedDataEntry, ...dataEntryArray];
  return updateDataEntryObject(versionParser.objectGeneratorParameters, virginDataEntryArray);
};

// src/objectmap/versionUserMethods.ts
var createParserObject = (versionArray, versionBitCount, enumSemanticsMapping, attributeSemanticsMapping) => {
  const maxAllowedParsers = getMaxIntegerValueForGivenBitWidth(versionBitCount);
  if (versionArray.length > maxAllowedParsers)
    throw new Error(`Cannot have more than ${maxAllowedParsers} versions`);
  return {
    versionBitCount,
    parsers: versionArray.map((version, index) => ({
      attributeSemanticsMapping: attributeSemanticsMapping ? Array.isArray(attributeSemanticsMapping) ? attributeSemanticsMapping[index] : attributeSemanticsMapping : undefined,
      enumSemanticsMapping: enumSemanticsMapping ? Array.isArray(enumSemanticsMapping) ? enumSemanticsMapping[index] : enumSemanticsMapping : undefined,
      objectGeneratorParameters: parseVersionArrayDefinitionTypeToVersionDefinitionObject(version, index)
    }))
  };
};
var parseUrl = (urlSafeBase64, parserVersions) => parseUrlMethod(urlSafeBase64, parserVersions);
var updateDataEntry2 = (updatedEntry, currentObject, parserVersions) => updateDataEntry(currentObject, updatedEntry, parserVersions.parsers);
var getURLSafeBase64ForData = (data) => getURLForData(data);
var internalParseDataEntry = (data, enumSemanticsMapping) => {
  if (data.type === DataType.ENUM && enumSemanticsMapping) {
    const mapping = enumSemanticsMapping[data.name]?.find((entry) => entry.value === data.value);
    if (mapping)
      return mapping.label;
  }
  return data.value;
};
var internalStrictSemanticallyNestedValues = (data, enumSemanticsMapping, attributeSemanticsMapping) => Object.fromEntries(Object.entries(data).map(([key, value]) => [
  attributeSemanticsMapping ? attributeSemanticsMapping[key] ?? key : key,
  value.type !== undefined ? internalParseDataEntry(value, enumSemanticsMapping) : internalStrictSemanticallyNestedValues(value, enumSemanticsMapping, attributeSemanticsMapping)
]));
var getSemanticallyNestedValues = (data, parserVersions) => {
  const versionNumber = data.version.value;
  const enumSemanticsMapping = parserVersions.parsers[versionNumber]?.enumSemanticsMapping;
  const attributeSemanticsMapping = parserVersions.parsers[versionNumber]?.attributeSemanticsMapping;
  return internalStrictSemanticallyNestedValues(data, enumSemanticsMapping, attributeSemanticsMapping);
};
var getDefaultObject = (parserForVersions, versionindex) => {
  if (!parserForVersions.parsers[versionindex])
    throw new Error(`No parser for version ${versionindex} index`);
  return nestedDataEntryArrayToObject(parserForVersions.parsers[versionindex].objectGeneratorParameters);
};
var getFlatArray = (data) => parseDownNestedDataDescription(data);
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
  updateDataEntry2 as updateDataEntry,
  parseUrl,
  interpolateEntryAt,
  getURLSafeBase64ForData,
  getSemanticallyNestedValues,
  getRelativeValue,
  getFlatArray,
  getDefaultObject,
  createParserObject,
  SignificandMaxBits,
  ObjectGenerationOutputStatus,
  IntegerMaxBits,
  DataType,
  DataEntryFactory
};
