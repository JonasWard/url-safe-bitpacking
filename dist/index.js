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

// src/types/arrayDefinitions.ts
var PREFIX_SEPERATOR_DELIMETER = "_";
// src/types/enumData.ts
var EnumMaxBits = 8;
// src/types/intData.ts
var IntegerMaxBits = 12;
// src/types/versionData.ts
var VersionRange = [4, 6, 8, 10];
// src/factory/helperMethod.ts
var getBitsForIntegerNumber = (number, maxBits) => {
  const bitCount = Math.ceil(Math.log2(number));
  if (bitCount > maxBits)
    throw new Error(`Cannot get ${maxBits} bits for a number with ${bitCount} bits`);
  return bitCount;
};
var getMinimumBitsForInteger = (v) => Math.ceil(Math.log2(v));
var getVersionValueRangeValueForNumber = (v) => {
  const minBits = getMinimumBitsForInteger(v);
  const versionBits = VersionRange.find((x) => x >= minBits);
  if (versionBits === undefined)
    throw new Error(`Cannot find version range for ${v}, max amount of versions allowed is ${2 ** VersionRange[VersionRange.length - 1]}`);
  return versionBits;
};

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
// src/parsers/intParser.ts
var getBitsCount = (intData3) => intData3.bits;
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
var rawParser = (stateString, intData3) => {
  const v = rawValueParser(stateString, intData3.bits) + intData3.min;
  if (v > intData3.max)
    throw new Error("Value exceeds max");
  return v;
};
var rawIntStringifier = (value, bitCount) => {
  if (Number.isInteger(value) === false)
    throw new Error("Value is not an integer");
  return value.toString(2).padStart(bitCount, "0");
};
var rawStringifier = (value, intData3) => {
  if (value < intData3.min)
    throw new Error("Value is below min");
  if (value > intData3.max)
    throw new Error("Value exceeds max");
  return rawIntStringifier(value - intData3.min, intData3.bits);
};

// src/parsers/floatParser.ts
var getBitsCount2 = (floatData3) => floatData3.significand;
var rawValueParser2 = (stateString, significandBits, precision) => {
  if (stateString.length < significandBits)
    throw new Error(`To few bits for this float bit string (${stateString.length} instead of ${significandBits})`);
  if (stateString.length > significandBits)
    throw new Error(`To many bits for this float bit string (${stateString.length} instead of ${significandBits})`);
  const significand = rawValueParser(stateString, significandBits);
  return significand * 10 ** -precision;
};
var rawParser2 = (stateString, floatData3) => {
  const v = floatData3.min + rawValueParser2(stateString, floatData3.significand, floatData3.precision);
  if (v > floatData3.max)
    throw new Error("Float value exceeds max");
  return v;
};
var rawStringifier2 = (value, floatData3) => rawIntStringifier(Math.round((value - floatData3.min) * 10 ** floatData3.precision), floatData3.significand);

// src/parsers/enumParser.ts
var getBitsCount3 = (versionData2) => versionData2.bits;
var rawParser3 = (rawString, versionData2) => rawValueParser(rawString, versionData2.bits);
var rawStringifier3 = (value, versionData2) => {
  if (value > versionData2.max)
    throw new Error("Version exceeds max");
  return rawIntStringifier(value, versionData2.bits);
};

// src/parsers/versionParser.ts
var getBitsCount4 = (versionData2) => versionData2.bits;
var rawParser4 = (rawString, versionData2) => rawValueParser(rawString, versionData2.bits);
var rawStringifier4 = (value, versionData2) => {
  if (value > 2 ** versionData2.bits - 1)
    throw new Error("Version exceeds max");
  return rawIntStringifier(value, versionData2.bits);
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
var dataEntryBitstringParser = (bitstring, dataEntry2) => [
  dataBitsParser(bitstring.slice(0, getBitsCount6(dataEntry2)), dataEntry2),
  bitstring.slice(getBitsCount6(dataEntry2))
];
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
var dataEntryCorrecting = (dataEntry2) => dataBitsParser(dataBitsStringifier(dataEntry2), dataEntry2);
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
// src/objectmap/stateValueHelperMethods.ts
var flattenDerivativeStateDataType = (stateValue) => [
  stateValue.s,
  ...Array.isArray(stateValue.v) ? stateValue.v.map(getDataEntryArray).flat() : getDataEntryArray(stateValue.v)
];
var internalGetDataEntryArray = (stateValue) => Object.values(stateValue).map((content) => {
  if (content.type !== undefined)
    return content;
  else if (content.s !== undefined && content.v !== undefined) {
    return flattenDerivativeStateDataType(content);
  } else
    return internalGetDataEntryArray(content);
}).flat();
var getStateValueHelperMethod = (stateValue) => {
  if (stateValue.type !== undefined)
    return stateValue.value;
  else if (stateValue.s !== undefined && stateValue.v !== undefined)
    return {
      s: stateValue.s.value,
      v: Array.isArray(stateValue.v) ? stateValue.v.map(getStateValue) : getStateValue(stateValue.v)
    };
  else
    return getStateValue(stateValue);
};
var getStateValue = (stateValue) => Object.fromEntries(Object.entries(stateValue).map(([key, value]) => [key, getStateValueHelperMethod(value)]));
var getDataEntryArray = (stateValue) => internalGetDataEntryArray(stateValue).sort((a, b) => a.index - b.index);
var getBase64String = (stateValue) => parseBitsToBase64(dataArrayStringifier(getDataEntryArray(stateValue)));
var isSingleLevelContentType = (data) => singleLevelContentTypeIsDataEntry(data[0]) || singleLevelContentTypeIsNestedContentDataType(data[0]) && !doubleLevelContentTypeIsArrayDefinitionType(data);
var isDoubleLevelContentType = (data) => !isSingleLevelContentType(data);
var singleLevelContentTypeIsDataEntry = (data) => !Array.isArray(data) && typeof data === "object";
var singleLevelContentTypeIsNestedContentDataType = (data) => Array.isArray(data) && typeof data[0] === "string";
var doubleLevelContentTypeIsEnumEntryDataType = (data) => isDoubleLevelContentType(data) && typeof data[0] === "number";
var doubleLevelContentTypeIsOptionalEntryDataType = (data) => isDoubleLevelContentType(data) && typeof data[0] === "boolean";
var doubleLevelContentTypeIsArrayDefinitionType = (data) => Array.isArray(data[0]) && data[0].length === 2 && typeof data[0][0] === "number" && typeof data[0][1] === "number";

// src/objectmap/stateDataModel.ts
var currentDataEntryIndex = 0;
var findExistingDataEntry = (dataEntry2, dataEntryArray) => dataEntryArray.find((d) => (d.internalName ?? d.name) === (dataEntry2.internalName ?? dataEntry2.name));
var readDataEntry = (dataEntry2, bitString) => {
  const [d, slicedBitstring] = dataEntryBitstringParser(bitString, dataEntry2);
  currentDataEntryIndex++;
  return [slicedBitstring, [d.name, { ...d, index: currentDataEntryIndex }]];
};
var updateDataEntry = (dataEntry2, existingData) => {
  const existingDataEntry = findExistingDataEntry(dataEntry2, existingData);
  currentDataEntryIndex++;
  return [existingData, [dataEntry2.name, { ...existingDataEntry ? updateValue6(dataEntry2, existingDataEntry) : dataEntry2, index: currentDataEntryIndex }]];
};
var internalGetDataEntry = (dataEntry2, prefix, additionalData) => {
  const internalName = `${prefix}${PREFIX_SEPERATOR_DELIMETER}${dataEntry2.name}`;
  const localDataEntry = { ...dataEntry2, internalName };
  if (additionalData) {
    if (typeof additionalData === "string")
      return readDataEntry(localDataEntry, additionalData);
    else
      return updateDataEntry(localDataEntry, additionalData);
  }
  currentDataEntryIndex++;
  return [undefined, [localDataEntry.name, { ...localDataEntry, index: currentDataEntryIndex }]];
};
var getStateFromOptionalEntryDataType = (oedt, prefix, attributeName) => (additionalData) => {
  const [updatedLocalAdditionalData, [__, s]] = internalGetDataEntry(DataEntryFactory.createBoolean(oedt[0], attributeName), prefix, additionalData);
  const [localAdditionalData, [_, v]] = getStateDateFromSingleLevelContentTypeArray(oedt[Number(s.value) + 1], s.internalName, attributeName)(updatedLocalAdditionalData);
  return [
    localAdditionalData,
    [
      attributeName,
      {
        s,
        v
      }
    ]
  ];
};
var getStateFromEnumEntryDataType = (eedt, prefix, attributeName) => (additionalData) => {
  if (Math.round(eedt[0]) !== eedt[0])
    `given default (${eedt[0]}) value isn't an integer, rounding it`;
  if (eedt.length - 2 < Math.round(eedt[0]))
    console.log(`given default value (${eedt[0]}) was larger than the amount of options available, using the largest value (${eedt.length - 2}) instead`);
  if (eedt[0] < 0)
    console.log(`given default value (${eedt[0]}) was negative, using first index (0) instead`);
  const [updatedLocalAdditionalData, [__, s]] = internalGetDataEntry(DataEntryFactory.createEnum(Math.max(Math.min(eedt.length - 2, Math.round(eedt[0])), 0), eedt.length - 1, attributeName), prefix, additionalData);
  const [nestedAdditionalData, [_, v]] = getStateDateFromSingleLevelContentTypeArray(eedt[1 + s.value], s.internalName, attributeName)(updatedLocalAdditionalData);
  return [
    nestedAdditionalData,
    [
      attributeName,
      {
        s,
        v
      }
    ]
  ];
};
var getStateFromArrayEntryDataType = (aedt, prefix, attributeName) => (additionalData) => {
  const [min, max] = [aedt[0][0], aedt[0][1]].sort((a, b) => a - b);
  const [updatedAdditionalData, [__, s]] = internalGetDataEntry(DataEntryFactory.createInt(min, min, max, attributeName), prefix, additionalData);
  const v = [];
  let localAdditionalData = updatedAdditionalData;
  for (let i = 0;i < s.value; i++) {
    const [updateAdditionalData, [_, localStateData]] = getStateDateFromSingleLevelContentTypeArray(aedt[1], `${s.internalName}${PREFIX_SEPERATOR_DELIMETER}${i}`, attributeName)(localAdditionalData);
    localAdditionalData = updateAdditionalData;
    v.push(localStateData);
  }
  return [
    localAdditionalData,
    [
      attributeName,
      {
        s,
        v
      }
    ]
  ];
};
var getStateDataFromDoubleLevelContentType = (dct, prefix, attributeName) => {
  if (doubleLevelContentTypeIsEnumEntryDataType(dct))
    return getStateFromEnumEntryDataType(dct, prefix, attributeName);
  else if (doubleLevelContentTypeIsOptionalEntryDataType(dct))
    return getStateFromOptionalEntryDataType(dct, prefix, attributeName);
  else if (doubleLevelContentTypeIsArrayDefinitionType(dct))
    return getStateFromArrayEntryDataType(dct, prefix, attributeName);
  throw new Error("this is an invalid output value, wonder why?");
};
var getStateDateFromSingleLevelContentTypeArray = (slcta, prefix, attributeName) => (additionalData) => {
  const outputDataObject = {};
  let intermediateAdditionalData = additionalData;
  slcta.forEach((slct) => {
    const [localAdditionalData, [localAttributeName, nestedData]] = getStateDataFromSingleLevelContentType(slct, prefix)(intermediateAdditionalData);
    intermediateAdditionalData = localAdditionalData;
    outputDataObject[localAttributeName] = nestedData;
  });
  return [intermediateAdditionalData, [attributeName, outputDataObject]];
};
var getStateDataFromNestedContentType = (nct, prefix, attributeName) => {
  if (isDoubleLevelContentType(nct))
    return getStateDataFromDoubleLevelContentType(nct, `${prefix}${PREFIX_SEPERATOR_DELIMETER}${attributeName}`, attributeName);
  return getStateDateFromSingleLevelContentTypeArray(nct, prefix, attributeName);
};
var getStateDataFromSingleLevelContentType = (slct, prefix) => {
  if (singleLevelContentTypeIsDataEntry(slct))
    return (additionalData) => internalGetDataEntry(slct, prefix, additionalData);
  else if (singleLevelContentTypeIsNestedContentDataType(slct))
    return getStateDataFromNestedContentType(slct[1], `${prefix}_${slct[0]}`, slct[0]);
  throw new Error("this is an invalid output value, wonder why?");
};
var getGenerationMethodForSingleLevelContentTypeArray = (slct) => {
  currentDataEntryIndex = -1;
  return (additionalData) => getStateDateFromSingleLevelContentTypeArray(slct, "", "")(additionalData)[1][1];
};
// src/objectmap/userMethods.ts
var getParsedAdditionalData = (additionalData) => {
  if (typeof additionalData === "string")
    return parseBase64ToBits(additionalData);
  if (additionalData && !Array.isArray(additionalData))
    return getDataEntryArray(additionalData);
  return additionalData;
};
var getVersionindex = (additionalData, versionMask, defaultIndex) => {
  if (typeof additionalData === "string")
    return readDataEntry(versionMask, additionalData)[1][1].value;
  if (!additionalData)
    return defaultIndex || 0;
  return additionalData.find((d) => d.name === "version")?.value ?? defaultIndex ?? 0;
};
var getParserMethodForVersionDefinition = (vadt, versionBits, defaultVersion) => (state) => {
  const additionalData = getParsedAdditionalData(state);
  const versionIndex = getVersionindex(additionalData, DataEntryFactory.createVersion(0, versionBits, "version"), defaultVersion);
  const versionDefinition = vadt[versionIndex];
  const versionEntry = DataEntryFactory.createVersion(versionIndex, versionBits, "version");
  return getGenerationMethodForSingleLevelContentTypeArray([versionEntry, ...versionDefinition])(additionalData);
};
var getUpdaterMethodForVersionDefinition = (parser) => (state, entryToUpdate) => parser([...Array.isArray(entryToUpdate) ? entryToUpdate : [entryToUpdate], ...getDataEntryArray(state)]);
var getStringifyMethodForVersionDefinition = (parser) => (data) => getBase64String(parser(data));
var createParserObject = (versionContent, maximumExpectedVersions, defaultVersion, enumSemanticsMapping, attributeSemanticsMapping, exposedVersions) => {
  const versionBitCount = getVersionValueRangeValueForNumber(maximumExpectedVersions);
  const localDefaultVersion = Math.max(0, Math.min(versionContent.length - 1, defaultVersion ?? 0));
  if (versionContent.length > maximumExpectedVersions)
    throw new Error(`Cannot have more than ${maximumExpectedVersions} versions`);
  if (localDefaultVersion !== (defaultVersion ?? 0))
    console.log(`Default version must be between 0 and ${versionContent.length - 1}, instead of ${defaultVersion} will be using ${localDefaultVersion}`);
  const parser = getParserMethodForVersionDefinition(versionContent, versionBitCount, localDefaultVersion);
  const updater = getUpdaterMethodForVersionDefinition(parser);
  const stringify = getStringifyMethodForVersionDefinition(parser);
  return {
    versionBitCount,
    exposedVersions,
    parser,
    updater,
    stringify,
    enumSemanticsMapping,
    attributeSemanticsMapping
  };
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
  parseBase64ToBits,
  interpolateEntryAt,
  getStateValue,
  getRelativeValue,
  getDataEntryArray,
  getBase64String,
  createParserObject,
  SignificandMaxBits,
  IntegerMaxBits,
  DataType,
  DataEntryFactory
};
