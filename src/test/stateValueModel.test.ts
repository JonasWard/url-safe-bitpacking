import { expect, test } from 'bun:test';
import { StateDataType } from '../types';
// import { createParserObject } from '../objectmap/versionUserMethods';
// import { getDefaultObject } from '../objectmap/stateValueDefaultObject';
import {
  getStateFromOptionalEntryDataType,
  getStateFromEnumEntryDataType,
  getStateFromArrayEntryDataType,
  getStateDataFromNestedContentType,
  testOnlyResetCurrentDataEntryIndex,
} from '../objectmap/stateDataModel';
import { ncdt_0, ncdt_1, ncdt_2, oedt_0, oedt_1, oedt_2, eedt_0, eedt_1, eedt_2, aedt_0, aedt_1, aedt_2, lucernaeTurici } from './arrayDefinition.example';
import { getBase64String, createParserObject } from '../objectmap';
import { parseBase64ToBits } from '../parsers';
import { DataEntry } from '../types';

// wrapper method to reset the indexes after having run the parser one, only needs to be done for tests
const r = (v: any) => {
  testOnlyResetCurrentDataEntryIndex();
  return v;
};

// nested content data type testing
const ncdt_results: any = [
  {
    someFloat: {
      value: 0,
      type: 'FLOAT',
      min: 0,
      max: 1,
      precision: 2,
      significand: 7,
      name: 'someFloat',
      index: 0,
      internalName: '_someFloat'
    }
  },
  {
    aBoolean: {
      value: true,
      type: 'BOOLEAN',
      name: 'aBoolean',
      index: 0,
      internalName: '_aBoolean'
    }
  },
  {
    anEnum: {
      value: 0,
      type: 'ENUM',
      max: 4,
      bits: 3,
      name: 'anEnum',
      index: 0,
      internalName: '_anEnum'
    }
  }
];

const ncdt_urls = ['AA', 'g', 'A'];

const ncdt_valuesToUpdate: any = [
  {
    value: 1,
    type: 'FLOAT',
    min: 0,
    max: 1,
    precision: 2,
    significand: 7,
    name: 'someFloat',
    index: 0,
    internalName: '_someFloat'
  },
  {
    value: false,
    type: 'BOOLEAN',
    name: 'aBoolean',
    index: 0,
    internalName: '_aBoolean'
  },
  {
    value: 3,
    type: 'ENUM',
    max: 4,
    bits: 3,
    name: 'anEnum',
    index: 0,
    internalName: '_anEnum'
  }
];

const nctd_updatedValues: any = [
  {
    someFloat: {
      value: 1,
      type: 'FLOAT',
      min: 0,
      max: 1,
      precision: 2,
      significand: 7,
      name: 'someFloat',
      index: 0,
      internalName: '_someFloat'
    }
  },
  {
    aBoolean: {
      value: false,
      type: 'BOOLEAN',
      name: 'aBoolean',
      index: 0,
      internalName: '_aBoolean'
    }
  },
  {
    anEnum: {
      value: 3,
      type: 'ENUM',
      max: 4,
      bits: 3,
      name: 'anEnum',
      index: 0,
      internalName: '_anEnum'
    }
  }
];

const nctd_updated_urls = ['yA', 'A', 'Y'];

test('stateValueModel - NestedContendDataType - method computing', () =>
  [ncdt_0, ncdt_1, ncdt_2].forEach((ncdt) =>
    expect(
      (() => {
        getStateDataFromNestedContentType(ncdt[1], '', ncdt[0]);
        return true;
      })()
    ).toBe(true)
  ));

test('stateValueModel - NestedContendDataType - default state data type', () => {
  testOnlyResetCurrentDataEntryIndex();
  [ncdt_0, ncdt_1, ncdt_2].forEach((ncdt, i) =>
    expect(r(getStateDataFromNestedContentType(ncdt[1], '', ncdt[0])()[1][1])).toEqual(ncdt_results[i])
  ); // checking whether the content is as expected
  [ncdt_0, ncdt_1, ncdt_2].forEach((ncdt) =>
    expect(r(getStateDataFromNestedContentType(ncdt[1], '', ncdt[0])()[1][0])).toEqual(ncdt[0])
  ); // checking whether the attribute name is the same
  [ncdt_0, ncdt_1, ncdt_2].forEach((ncdt, i) =>
    expect(
      r(getBase64String(getStateDataFromNestedContentType(ncdt[1], '', ncdt[0])()[1][1] as StateDataType))
    ).toEqual(ncdt_urls[i])
  ); // checking whether the attribute name is the same
  ncdt_urls.forEach((ncdt, i) =>
    expect(
      r(getStateDataFromNestedContentType([ncdt_0, ncdt_1, ncdt_2][i][1], '', '')(parseBase64ToBits(ncdt)))[1][1]
    ).toEqual(ncdt_results[i])
  ); // checking whether it parses correctly to base64 and back
});

test('stateValueModel - NestedContendDataType - update data model', () => {
  testOnlyResetCurrentDataEntryIndex();
  [ncdt_0, ncdt_1, ncdt_2].forEach((ncdt, i) =>
    expect(r(getStateDataFromNestedContentType(ncdt[1], '', ncdt[0])([ncdt_valuesToUpdate[i]])[1][1])).toEqual(
      nctd_updatedValues[i]
    )
  ); // checking whether the content is as expected
  [ncdt_0, ncdt_1, ncdt_2].forEach((ncdt, i) =>
    expect(r(getStateDataFromNestedContentType(ncdt[1], '', ncdt[0])([ncdt_valuesToUpdate[i]]))[1][0]).toEqual(ncdt[0])
  ); // checking whether the content is as expected
  [ncdt_0, ncdt_1, ncdt_2].forEach((ncdt, i) =>
    expect(
      r(
        getBase64String(
          getStateDataFromNestedContentType(ncdt[1], '', ncdt[0])([ncdt_valuesToUpdate[i]])[1][1] as StateDataType
        )
      )
    ).toEqual(nctd_updated_urls[i])
  ); // checking whether the content is as expected
  nctd_updated_urls.forEach((ncdt, i) =>
    expect(
      r(getStateDataFromNestedContentType([ncdt_0, ncdt_1, ncdt_2][i][1], '', '')(parseBase64ToBits(ncdt)))[1][1]
    ).toEqual(nctd_updatedValues[i])
  ); // checking whether it parses correctly to base64 and back
});

// optional entry content testing
const oedt_results: any = [
  {
    s: {
      value: true,
      type: 'BOOLEAN',
      name: 'oedt_0',
      index: 0,
      internalName: '_oedt_0'
    },
    v: {}
  },
  {
    s: {
      value: true,
      type: 'BOOLEAN',
      name: 'oedt_1',
      index: 0,
      internalName: '_oedt_1'
    },
    v: {
      someFloat: {
        value: 0,
        type: 'FLOAT',
        min: 0,
        max: 1,
        precision: 2,
        significand: 7,
        name: 'someFloat',
        index: 1,
        internalName: '_oedt_1_someFloat'
      }
    }
  },
  {
    s: {
      value: false,
      type: 'BOOLEAN',
      name: 'oedt_2',
      index: 0,
      internalName: '_oedt_2'
    },
    v: {}
  }
];

const oedt_urls = ['g', 'gA', 'A'];

const oedt_valuesToUpdate: any = [
  {
    value: false,
    type: 'BOOLEAN',
    name: 'oedt_0',
    index: 0,
    internalName: '_oedt_0'
  },
  {
    value: false,
    type: 'BOOLEAN',
    name: 'oedt_1',
    index: 0,
    internalName: '_oedt_1'
  },
  {
    value: true,
    type: 'BOOLEAN',
    name: 'oedt_2',
    index: 0,
    internalName: '_oedt_2'
  }
];

const oedt_updatedValues: any = [
  {
    s: {
      value: false,
      type: 'BOOLEAN',
      name: 'oedt_0',
      index: 0,
      internalName: '_oedt_0'
    },
    v: {
      someFloat: {
        index: 1,
        internalName: '_oedt_0_someFloat',
        max: 1,
        min: 0,
        name: 'someFloat',
        precision: 2,
        significand: 7,
        type: 'FLOAT',
        value: 0
      }
    }
  },
  {
    s: {
      value: false,
      type: 'BOOLEAN',
      name: 'oedt_1',
      index: 0,
      internalName: '_oedt_1'
    },
    v: {}
  },
  {
    s: {
      value: true,
      type: 'BOOLEAN',
      name: 'oedt_2',
      index: 0,
      internalName: '_oedt_2'
    },
    v: {
      someFloat: {
        index: 1,
        internalName: '_oedt_2_someFloat',
        max: 1,
        min: 0,
        name: 'someFloat',
        precision: 2,
        significand: 7,
        type: 'FLOAT',
        value: 0
      }
    }
  }
];

const oedt_updated_urls = ['AA', 'A', 'gA'];

test('stateValueModel - OptionalContendDataType - method computing', () =>
  [oedt_0, oedt_1, oedt_2].forEach((oedt) =>
    expect(
      (() => {
        getStateFromOptionalEntryDataType(oedt, '', '');
        return true;
      })()
    ).toBe(true)
  ));

test('stateValueModel - OptionalContendDataType - default state data type', () => {
  testOnlyResetCurrentDataEntryIndex();

  [oedt_0, oedt_1, oedt_2].forEach((oedt, i) =>
    expect(r(getStateFromOptionalEntryDataType(oedt, '', `oedt_${i}`)()[1][1])).toEqual(oedt_results[i])
  ); // checking whether the content is as expected
  [oedt_0, oedt_1, oedt_2].forEach((oedt, i) =>
    expect(r(getStateFromOptionalEntryDataType(oedt, '', `oedt_${i}`)()[1][0])).toEqual(`oedt_${i}`)
  ); // checking whether the attribute name is the same
  [oedt_0, oedt_1, oedt_2].forEach((oedt, i) =>
    expect(
      r(getBase64String(getStateFromOptionalEntryDataType(oedt, '', `oedt_${i}`)()[1][1] as StateDataType))
    ).toEqual(oedt_urls[i])
  ); // checking whether the attribute name is the same
  oedt_urls.forEach((oedt, i) =>
    expect(
      r(getStateFromOptionalEntryDataType([oedt_0, oedt_1, oedt_2][i], '', `oedt_${i}`)(parseBase64ToBits(oedt)))[1][1]
    ).toEqual(oedt_results[i])
  ); // checking whether it parses correctly to base64 and back
});

test('stateValueModel - OptionalContendDataType - update data model', () => {
  testOnlyResetCurrentDataEntryIndex();

  [oedt_0, oedt_1, oedt_2].forEach((oedt, i) =>
    expect(r(getStateFromOptionalEntryDataType(oedt, '', `oedt_${i}`)([oedt_valuesToUpdate[i]])[1][1])).toEqual(
      oedt_updatedValues[i]
    )
  ); // checking whether the content is as expected
  [oedt_0, oedt_1, oedt_2].forEach((oedt, i) =>
    expect(r(getStateFromOptionalEntryDataType(oedt, '', `oedt_${i}`)([oedt_valuesToUpdate[i]]))[1][0]).toEqual(
      `oedt_${i}`
    )
  ); // checking whether the content is as expected
  [oedt_0, oedt_1, oedt_2].forEach((oedt, i) =>
    expect(
      r(
        getBase64String(
          getStateFromOptionalEntryDataType(oedt, '', `oedt_${i}`)([oedt_valuesToUpdate[i]])[1][1] as StateDataType
        )
      )
    ).toEqual(oedt_updated_urls[i])
  ); // checking whether the attribute name is the same
  oedt_updated_urls.forEach((oedt, i) =>
    expect(
      getBase64String(
        r(
          getStateFromOptionalEntryDataType([oedt_0, oedt_1, oedt_2][i], '', `oedt_${i}`)(parseBase64ToBits(oedt))
        )[1][1]
      )
    ).toEqual(oedt_updated_urls[i])
  ); // checking whether it parses correctly to base64 and back
});

// enum entry content testing
const eedt_results: any = [
  {
    s: { value: 1, type: 'ENUM', max: 3, bits: 2, name: 'eedt_0', index: 0, internalName: '_eedt_0' },
    v: {
      someFloat_eedt_0_1: {
        value: 0,
        type: 'FLOAT',
        min: 0,
        max: 1,
        precision: 2,
        significand: 7,
        name: 'someFloat_eedt_0_1',
        index: 1,
        internalName: '_eedt_0_someFloat_eedt_0_1'
      }
    }
  },
  {
    s: { value: 1, type: 'ENUM', max: 2, bits: 2, name: 'eedt_1', index: 0, internalName: '_eedt_1' },
    v: {
      someFloat_eedt_1_1: {
        value: 0,
        type: 'FLOAT',
        min: 0,
        max: 1,
        precision: 2,
        significand: 7,
        name: 'someFloat_eedt_1_1',
        index: 1,
        internalName: '_eedt_1_someFloat_eedt_1_1'
      }
    }
  },
  {
    s: { value: 2, type: 'ENUM', max: 4, bits: 3, name: 'eedt_2', index: 0, internalName: '_eedt_2' },
    v: {
      someFloat_eedt_2_2: {
        value: 0,
        type: 'FLOAT',
        min: 0,
        max: 1,
        precision: 2,
        significand: 7,
        name: 'someFloat_eedt_2_2',
        index: 1,
        internalName: '_eedt_2_someFloat_eedt_2_2'
      }
    }
  }
];

const eedt_urls = ['QA', 'QA', 'QA'];

const eedt_valuesToUpdate: any = [
  {
    bits: 2,
    index: 0,
    internalName: '_eedt_0',
    max: 3,
    name: 'eedt_0',
    type: 'ENUM',
    value: 0
  },
  { value: 0, type: 'ENUM', max: 2, bits: 2, name: 'eedt_1', index: 0, internalName: '_eedt_1' },
  { value: 0, type: 'ENUM', max: 4, bits: 3, name: 'eedt_2', index: 0, internalName: '_eedt_2' }
];

const eedt_updatedValues: any = undefined;

const eedt_updated_urls = ['AA', 'AA', 'AA'];

test('stateValueModel - EnumEntryContentDataType - method computing', () =>
  [eedt_0, eedt_1, eedt_2].forEach((eedt) =>
    expect(
      (() => {
        getStateFromEnumEntryDataType(eedt, '', '');
        return true;
      })()
    ).toBe(true)
  ));

test('stateValueModel - EnumEntryContentDataType - default state data type', () => {
  testOnlyResetCurrentDataEntryIndex();
  [eedt_0, eedt_1, eedt_2].forEach((eedt, i) =>
    expect(r(getStateFromEnumEntryDataType(eedt, '', `eedt_${i}`)()[1][1])).toEqual(eedt_results[i])
  ); // checking whether the content is as expected
  [eedt_0, eedt_1, eedt_2].forEach((eedt, i) =>
    expect(r(getStateFromEnumEntryDataType(eedt, '', `eedt_${i}`)()[1][0])).toEqual(`eedt_${i}`)
  ); // checking whether the attribute name is the same
  [eedt_0, eedt_1, eedt_2].forEach((eedt, i) =>
    expect(r(getBase64String(getStateFromEnumEntryDataType(eedt, '', `eedt_${i}`)()[1][1] as StateDataType))).toEqual(
      eedt_urls[i]
    )
  ); // checking whether the attribute name is the same
  eedt_urls.forEach((eedt, i) =>
    expect(
      r(getStateFromEnumEntryDataType([eedt_0, eedt_1, eedt_2][i], '', `eedt_${i}`)(parseBase64ToBits(eedt)))[1][1]
    ).toEqual(eedt_results[i])
  ); // checking whether it parses correctly to base64 and back
});

test('stateValueModel - EnumEntryContentDataType - update data model', () => {
  testOnlyResetCurrentDataEntryIndex();
  [eedt_0, eedt_1, eedt_2].forEach((eedt, i) =>
    expect(r(getStateFromEnumEntryDataType(eedt, '', `eedt_${i}`)([eedt_valuesToUpdate[i]])[1][1])).toEqual(
      eedt_updatedValues[i]
    )
  ); // checking whether the content is as expected
  [eedt_0, eedt_1, eedt_2].forEach((eedt, i) =>
    expect(r(getStateFromEnumEntryDataType(eedt, '', `eedt_${i}`)([eedt_valuesToUpdate[i]]))[1][0]).toEqual(`eedt_${i}`)
  ); // checking whether the content is as expected
  [eedt_0, eedt_1, eedt_2].forEach((eedt, i) =>
    expect(
      r(
        getBase64String(
          getStateFromEnumEntryDataType(eedt, '', `eedt_${i}`)([eedt_valuesToUpdate[i]])[1][1] as StateDataType
        )
      )
    ).toEqual(eedt_updated_urls[i])
  ); // checking whether the attribute name is the same
  eedt_updated_urls.forEach((eedt, i) =>
    expect(
      r(getStateFromEnumEntryDataType([eedt_0, eedt_1, eedt_2][i], '', `eedt_${i}`)(parseBase64ToBits(eedt)))[1][1]
    ).toEqual(eedt_updatedValues[i])
  ); // checking whether it parses correctly to base64 and back
});

// arrat entry content testing
const aedt_results: any = [
  {
    s: { value: 0, type: 'INT', min: 0, max: 3, bits: 2, name: 'aedt_0', index: 0, internalName: '_aedt_0' },
    v: []
  },
  {
    s: { value: 1, type: 'INT', min: 1, max: 2, bits: 1, name: 'aedt_1', index: 0, internalName: '_aedt_1' },
    v: [
      {
        someFloat0: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'someFloat0',
          index: 1,
          internalName: '_aedt_1_0_someFloat0'
        },
        aedt_1_someFloat1: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'aedt_1_someFloat1',
          index: 2,
          internalName: '_aedt_1_0_aedt_1_someFloat1'
        }
      }
    ]
  },
  {
    s: { value: 2, type: 'INT', min: 2, max: 4, bits: 2, name: 'aedt_2', index: 0, internalName: '_aedt_2' },
    v: [
      {
        someFloat0: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'someFloat0',
          index: 1,
          internalName: '_aedt_2_0_someFloat0'
        },
        aedt_2_someFloat1: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'aedt_2_someFloat1',
          index: 2,
          internalName: '_aedt_2_0_aedt_2_someFloat1'
        }
      },
      {
        someFloat0: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'someFloat0',
          index: 3,
          internalName: '_aedt_2_1_someFloat0'
        },
        aedt_2_someFloat1: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'aedt_2_someFloat1',
          index: 4,
          internalName: '_aedt_2_1_aedt_2_someFloat1'
        }
      }
    ]
  }
];

const aedt_urls = ['A', 'AAA', 'AAAAA'];

const aedt_valuesToUpdate: any = [
  { value: 3, type: 'INT', min: 0, max: 3, bits: 2, name: 'aedt_0', index: 0, internalName: '_aedt_0' },
  { value: 2, type: 'INT', min: 1, max: 2, bits: 1, name: 'aedt_1', index: 0, internalName: '_aedt_1' },
  { value: 3, type: 'INT', min: 2, max: 4, bits: 2, name: 'aedt_2', index: 0, internalName: '_aedt_2' }
];

const aedt_updatedValues: any = [
  {
    s: { value: 3, type: 'INT', min: 0, max: 3, bits: 2, name: 'aedt_0', index: 0, internalName: '_aedt_0' },
    v: [
      {
        aedt_0_someFloat0: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'aedt_0_someFloat0',
          index: 1,
          internalName: '_aedt_0_0_aedt_0_someFloat0'
        }
      },
      {
        aedt_0_someFloat0: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'aedt_0_someFloat0',
          index: 2,
          internalName: '_aedt_0_1_aedt_0_someFloat0'
        }
      },
      {
        aedt_0_someFloat0: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'aedt_0_someFloat0',
          index: 3,
          internalName: '_aedt_0_2_aedt_0_someFloat0'
        }
      }
    ]
  },
  {
    s: { value: 2, type: 'INT', min: 1, max: 2, bits: 1, name: 'aedt_1', index: 0, internalName: '_aedt_1' },
    v: [
      {
        someFloat0: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'someFloat0',
          index: 1,
          internalName: '_aedt_1_0_someFloat0'
        },
        aedt_1_someFloat1: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'aedt_1_someFloat1',
          index: 2,
          internalName: '_aedt_1_0_aedt_1_someFloat1'
        }
      },
      {
        someFloat0: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'someFloat0',
          index: 3,
          internalName: '_aedt_1_1_someFloat0'
        },
        aedt_1_someFloat1: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'aedt_1_someFloat1',
          index: 4,
          internalName: '_aedt_1_1_aedt_1_someFloat1'
        }
      }
    ]
  },
  {
    s: { value: 3, type: 'INT', min: 2, max: 4, bits: 2, name: 'aedt_2', index: 0, internalName: '_aedt_2' },
    v: [
      {
        someFloat0: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'someFloat0',
          index: 1,
          internalName: '_aedt_2_0_someFloat0'
        },
        aedt_2_someFloat1: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'aedt_2_someFloat1',
          index: 2,
          internalName: '_aedt_2_0_aedt_2_someFloat1'
        }
      },
      {
        someFloat0: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'someFloat0',
          index: 3,
          internalName: '_aedt_2_1_someFloat0'
        },
        aedt_2_someFloat1: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'aedt_2_someFloat1',
          index: 4,
          internalName: '_aedt_2_1_aedt_2_someFloat1'
        }
      },
      {
        someFloat0: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'someFloat0',
          index: 5,
          internalName: '_aedt_2_2_someFloat0'
        },
        aedt_2_someFloat1: {
          value: 0,
          type: 'FLOAT',
          min: 0,
          max: 1,
          precision: 2,
          significand: 7,
          name: 'aedt_2_someFloat1',
          index: 6,
          internalName: '_aedt_2_2_aedt_2_someFloat1'
        }
      }
    ]
  }
];

const aedt_updated_urls = ['wAAA', 'gAAAA', 'QAAAAAAA'];

test('stateValueModel - ArrayEntryContentDataType - method computing', () =>
  [aedt_0, aedt_1, aedt_2].forEach((aedt) =>
    expect(
      (() => {
        getStateFromArrayEntryDataType(aedt, '', '');
        return true;
      })()
    ).toBe(true)
  ));

test('stateValueModel - ArrayEntryContentDataType - default state data type', () => {
  testOnlyResetCurrentDataEntryIndex();
  [aedt_0, aedt_1, aedt_2].forEach((aedt, i) =>
    expect(r(getStateFromArrayEntryDataType(aedt, '', `aedt_${i}`)()[1][1])).toEqual(aedt_results[i])
  ); // checking whether the content is as expected
  [aedt_0, aedt_1, aedt_2].forEach((aedt, i) =>
    expect(r(getStateFromArrayEntryDataType(aedt, '', `aedt_${i}`)()[1][0])).toEqual(`aedt_${i}`)
  ); // checking whether the attribute name is the same
  [aedt_0, aedt_1, aedt_2].forEach((aedt, i) =>
    expect(r(getBase64String(getStateFromArrayEntryDataType(aedt, '', `aedt_${i}`)()[1][1] as StateDataType))).toEqual(
      aedt_urls[i]
    )
  ); // checking whether the attribute name is the same
  aedt_urls.forEach((aedt, i) =>
    expect(
      r(getStateFromArrayEntryDataType([aedt_0, aedt_1, aedt_2][i], '', `aedt_${i}`)(parseBase64ToBits(aedt)))[1][1]
    ).toEqual(aedt_results[i])
  ); // checking whether it parses correctly to base64 and back
});

test('stateValueModel - ArrayEntryContentDataType - update data model', () => {
  testOnlyResetCurrentDataEntryIndex();
  [aedt_0, aedt_1, aedt_2].forEach((aedt, i) =>
    expect(r(getStateFromArrayEntryDataType(aedt, '', `aedt_${i}`)([aedt_valuesToUpdate[i]])[1][1])).toEqual(
      aedt_updatedValues[i]
    )
  ); // checking whether the content is as expected
  [aedt_0, aedt_1, aedt_2].forEach((aedt, i) =>
    expect(r(getStateFromArrayEntryDataType(aedt, '', `aedt_${i}`)([aedt_valuesToUpdate[i]]))[1][0]).toEqual(
      `aedt_${i}`
    )
  ); // checking whether the content is as expected
  [aedt_0, aedt_1, aedt_2].forEach((aedt, i) =>
    expect(
      r(
        getBase64String(
          getStateFromArrayEntryDataType(aedt, '', `aedt_${i}`)([aedt_valuesToUpdate[i]])[1][1] as StateDataType
        )
      )
    ).toEqual(aedt_updated_urls[i])
  ); // checking whether the attribute name is the same
  aedt_updated_urls.forEach((aedt, i) =>
    expect(
      r(getStateFromArrayEntryDataType([aedt_0, aedt_1, aedt_2][i], '', `aedt_${i}`)(parseBase64ToBits(aedt)))[1][1]
    ).toEqual(aedt_updatedValues[i])
  ); // checking whether it parses correctly to base64 and back
});

const lucernaeTurici_result: any = {
  extrusion: {
    s: {
      bits: 3,
      index: 1,
      internalName: '_extrusion_extrusion_extrusion',
      mapping: [0, 1, 2, 3, 4, 5],
      max: 5,
      name: 'extrusion',
      type: 'ENUM',
      value: 4
    },
    v: {
      divisionCount: {
        bits: 4,
        index: 8,
        internalName: '_extrusion_extrusion_extrusion_divisionCount',
        max: 10,
        min: 1,
        name: 'divisionCount',
        type: 'INT',
        value: 1
      },
      divisionPointedness: {
        index: 7,
        internalName: '_extrusion_extrusion_extrusion_divisionPointedness',
        max: 1,
        min: 0,
        name: 'divisionPointedness',
        precision: 2,
        significand: 7,
        type: 'FLOAT',
        value: 1
      },
      divisionResolution: {
        bits: 5,
        index: 9,
        internalName: '_extrusion_extrusion_extrusion_divisionResolution',
        max: 32,
        min: 1,
        name: 'divisionResolution',
        type: 'INT',
        value: 1
      },
      insetBottom: {
        index: 4,
        internalName: '_extrusion_extrusion_extrusion_insetBottom',
        max: 0.45,
        min: 0.01,
        name: 'insetBottom',
        precision: 2,
        significand: 6,
        type: 'FLOAT',
        value: 0.25
      },
      insetSides: {
        index: 5,
        internalName: '_extrusion_extrusion_extrusion_insetSides',
        max: 0.45,
        min: 0.01,
        name: 'insetSides',
        precision: 2,
        significand: 6,
        type: 'FLOAT',
        value: 0.25
      },
      insetTop: {
        index: 3,
        internalName: '_extrusion_extrusion_extrusion_insetTop',
        max: 0.45,
        min: 0.01,
        name: 'insetTop',
        precision: 2,
        significand: 6,
        type: 'FLOAT',
        value: 0.25
      },
      pointedness: {
        index: 6,
        internalName: '_extrusion_extrusion_extrusion_pointedness',
        max: 1,
        min: 0,
        name: 'pointedness',
        precision: 2,
        significand: 7,
        type: 'FLOAT',
        value: 1
      },
      radiusTop: {
        index: 2,
        internalName: '_extrusion_extrusion_extrusion_radiusTop',
        max: 1,
        min: 0.2,
        name: 'radiusTop',
        precision: 2,
        significand: 7,
        type: 'FLOAT',
        value: 0.35
      }
    }
  },
  footprint: {
    s: {
      bits: 3,
      index: 10,
      internalName: '_footprint_footprint_footprint',
      mapping: [0, 1, 2, 3, 4, 5, 6],
      max: 6,
      name: 'footprint',
      type: 'ENUM',
      value: 3
    },
    v: {
      bufferInside: {
        index: 15,
        internalName: '_footprint_footprint_footprint_bufferInside',
        max: 10,
        min: 0,
        name: 'bufferInside',
        precision: 1,
        significand: 7,
        type: 'FLOAT',
        value: 2
      },
      bufferOutside: {
        index: 16,
        internalName: '_footprint_footprint_footprint_bufferOutside',
        max: 10,
        min: 0,
        name: 'bufferOutside',
        precision: 1,
        significand: 7,
        type: 'FLOAT',
        value: 2
      },
      shellThickness: {
        bits: 2,
        index: 14,
        internalName: '_footprint_footprint_footprint_shellThickness',
        mapping: [0, 1, 2, 3],
        max: 3,
        name: 'shellThickness',
        type: 'ENUM',
        value: 0
      },
      size: {
        index: 11,
        internalName: '_footprint_footprint_footprint_size',
        max: 120,
        min: 8,
        name: 'size',
        precision: 0,
        significand: 7,
        type: 'FLOAT',
        value: 20
      },
      xCount: {
        bits: 4,
        index: 12,
        internalName: '_footprint_footprint_footprint_xCount',
        max: 16,
        min: 1,
        name: 'xCount',
        type: 'INT',
        value: 3
      },
      yCount: {
        bits: 4,
        index: 13,
        internalName: '_footprint_footprint_footprint_yCount',
        max: 8,
        min: 0,
        name: 'yCount',
        type: 'INT',
        value: 0
      }
    }
  },
  heights: {
    heightProcessingMethod: {
      s: {
        bits: 2,
        index: 19,
        internalName: '_heights_heightProcessingMethod_heightProcessingMethod_heightProcessingMethod',
        mapping: [0, 1, 2, 3],
        max: 3,
        name: 'heightProcessingMethod',
        type: 'ENUM',
        value: 1
      },
      v: {
        maxAmplitude: {
          index: 20,
          internalName: '_heights_heightProcessingMethod_heightProcessingMethod_heightProcessingMethod_maxAmplitude',
          max: 4,
          min: 0,
          name: 'maxAmplitude',
          precision: 1,
          significand: 6,
          type: 'FLOAT',
          value: 1
        },
        minAmplitude: {
          index: 21,
          internalName: '_heights_heightProcessingMethod_heightProcessingMethod_heightProcessingMethod_minAmplitude',
          max: 4,
          min: 0,
          name: 'minAmplitude',
          precision: 2,
          significand: 9,
          type: 'FLOAT',
          value: 1
        },
        period: {
          index: 22,
          internalName: '_heights_heightProcessingMethod_heightProcessingMethod_heightProcessingMethod_period',
          max: 200,
          min: 0.2,
          name: 'period',
          precision: 1,
          significand: 11,
          type: 'FLOAT',
          value: 1
        },
        phaseShift: {
          index: 23,
          internalName: '_heights_heightProcessingMethod_heightProcessingMethod_heightProcessingMethod_phaseShift',
          max: 360,
          min: 0,
          name: 'phaseShift',
          precision: 0,
          significand: 9,
          type: 'FLOAT',
          value: 0
        }
      }
    },
    storyCount: {
      bits: 5,
      index: 18,
      internalName: '_heights_storyCount',
      max: 20,
      min: 1,
      name: 'storyCount',
      type: 'INT',
      value: 7
    },
    totalHeight: {
      index: 17,
      internalName: '_heights_totalHeight',
      max: 300,
      min: 50,
      name: 'totalHeight',
      precision: 0,
      significand: 8,
      type: 'FLOAT',
      value: 150
    }
  },
  shapePreProcessing: {
    s: {
      bits: 2,
      index: 24,
      internalName: '_shapePreProcessing_shapePreProcessing_shapePreProcessing',
      mapping: [0, 1, 2, 3],
      max: 3,
      name: 'shapePreProcessing',
      type: 'ENUM',
      value: 2
    },
    v: {}
  },
  version: {
    bits: 4,
    index: 0,
    internalName: '_version',
    name: 'version',
    type: 'VERSION',
    value: 0
  }
};

const lucernaeTurici_base_64 = 'CD2GGMmQAMYQBQoyGSjIAgAQ';

const valueToUpdate: DataEntry = {
  value: 0,
  type: 'ENUM',
  max: 3,
  bits: 2,
  name: 'heightProcessingMethod',
  index: 19,
  internalName: '_heights_heightProcessingMethod_heightProcessingMethod_heightProcessingMethod'
};

const lucernaeTurici_updated_results: StateDataType = {
  version: { value: 0, type: 'VERSION', bits: 4, name: 'version', index: 0, internalName: '_version' },
  extrusion: {
    s: {
      value: 4,
      type: 'ENUM',
      max: 5,
      bits: 3,
      name: 'extrusion',
      index: 1,
      internalName: '_extrusion_extrusion_extrusion'
    },
    v: {
      radiusTop: {
        value: 0.35,
        type: 'FLOAT',
        min: 0.2,
        max: 1,
        precision: 2,
        significand: 7,
        name: 'radiusTop',
        index: 2,
        internalName: '_extrusion_extrusion_extrusion_radiusTop'
      },
      insetTop: {
        value: 0.25,
        type: 'FLOAT',
        min: 0.01,
        max: 0.45,
        precision: 2,
        significand: 6,
        name: 'insetTop',
        index: 3,
        internalName: '_extrusion_extrusion_extrusion_insetTop'
      },
      insetBottom: {
        value: 0.25,
        type: 'FLOAT',
        min: 0.01,
        max: 0.45,
        precision: 2,
        significand: 6,
        name: 'insetBottom',
        index: 4,
        internalName: '_extrusion_extrusion_extrusion_insetBottom'
      },
      insetSides: {
        value: 0.25,
        type: 'FLOAT',
        min: 0.01,
        max: 0.45,
        precision: 2,
        significand: 6,
        name: 'insetSides',
        index: 5,
        internalName: '_extrusion_extrusion_extrusion_insetSides'
      },
      pointedness: {
        value: 1,
        type: 'FLOAT',
        min: 0,
        max: 1,
        precision: 2,
        significand: 7,
        name: 'pointedness',
        index: 6,
        internalName: '_extrusion_extrusion_extrusion_pointedness'
      },
      divisionPointedness: {
        value: 1,
        type: 'FLOAT',
        min: 0,
        max: 1,
        precision: 2,
        significand: 7,
        name: 'divisionPointedness',
        index: 7,
        internalName: '_extrusion_extrusion_extrusion_divisionPointedness'
      },
      divisionCount: {
        value: 1,
        type: 'INT',
        min: 1,
        max: 10,
        bits: 4,
        name: 'divisionCount',
        index: 8,
        internalName: '_extrusion_extrusion_extrusion_divisionCount'
      },
      divisionResolution: {
        value: 1,
        type: 'INT',
        min: 1,
        max: 32,
        bits: 5,
        name: 'divisionResolution',
        index: 9,
        internalName: '_extrusion_extrusion_extrusion_divisionResolution'
      }
    }
  },
  footprint: {
    s: {
      value: 3,
      type: 'ENUM',
      max: 6,
      bits: 3,
      name: 'footprint',
      index: 10,
      internalName: '_footprint_footprint_footprint'
    },
    v: {
      size: {
        value: 20,
        type: 'FLOAT',
        min: 8,
        max: 120,
        precision: 0,
        significand: 7,
        name: 'size',
        index: 11,
        internalName: '_footprint_footprint_footprint_size'
      },
      xCount: {
        value: 3,
        type: 'INT',
        min: 1,
        max: 16,
        bits: 4,
        name: 'xCount',
        index: 12,
        internalName: '_footprint_footprint_footprint_xCount'
      },
      yCount: {
        value: 0,
        type: 'INT',
        min: 0,
        max: 8,
        bits: 4,
        name: 'yCount',
        index: 13,
        internalName: '_footprint_footprint_footprint_yCount'
      },
      shellThickness: {
        value: 0,
        type: 'ENUM',
        max: 3,
        bits: 2,
        name: 'shellThickness',
        index: 14,
        internalName: '_footprint_footprint_footprint_shellThickness'
      },
      bufferInside: {
        value: 2,
        type: 'FLOAT',
        min: 0,
        max: 10,
        precision: 1,
        significand: 7,
        name: 'bufferInside',
        index: 15,
        internalName: '_footprint_footprint_footprint_bufferInside'
      },
      bufferOutside: {
        value: 2,
        type: 'FLOAT',
        min: 0,
        max: 10,
        precision: 1,
        significand: 7,
        name: 'bufferOutside',
        index: 16,
        internalName: '_footprint_footprint_footprint_bufferOutside'
      }
    }
  },
  heights: {
    totalHeight: {
      value: 150,
      type: 'FLOAT',
      min: 50,
      max: 300,
      precision: 0,
      significand: 8,
      name: 'totalHeight',
      index: 17,
      internalName: '_heights_totalHeight'
    },
    storyCount: {
      value: 7,
      type: 'INT',
      min: 1,
      max: 20,
      bits: 5,
      name: 'storyCount',
      index: 18,
      internalName: '_heights_storyCount'
    },
    heightProcessingMethod: {
      s: {
        value: 0,
        type: 'ENUM',
        max: 3,
        bits: 2,
        name: 'heightProcessingMethod',
        index: 19,
        internalName: '_heights_heightProcessingMethod_heightProcessingMethod_heightProcessingMethod'
      },
      v: {
        total: {
          value: 20,
          type: 'FLOAT',
          min: 10,
          max: 200,
          precision: -1,
          significand: 5,
          name: 'total',
          index: 20,
          internalName: '_heights_heightProcessingMethod_heightProcessingMethod_heightProcessingMethod_total'
        },
        linearTwist: {
          value: 5,
          type: 'FLOAT',
          min: 0,
          max: 15,
          precision: 2,
          significand: 11,
          name: 'linearTwist',
          index: 21,
          internalName: '_heights_heightProcessingMethod_heightProcessingMethod_heightProcessingMethod_linearTwist'
        }
      }
    }
  },
  shapePreProcessing: {
    s: {
      value: 2,
      type: 'ENUM',
      max: 3,
      bits: 2,
      name: 'shapePreProcessing',
      index: 22,
      internalName: '_shapePreProcessing_shapePreProcessing_shapePreProcessing',
      mapping: [0, 1, 2, 3]
    },
    v: {}
  }
};

const lucernae_updated_base_64 = 'CD2GGMmQAMYQBQoyGAn0g';

test('stateValueModel - lucernaeTurici', () => {
  const versionHandler = createParserObject([lucernaeTurici], 1);
  const stateData = versionHandler.parser();
  expect(stateData).toMatchObject(lucernaeTurici_result);
  const base64 = getBase64String(stateData);
  expect(base64).toEqual(lucernaeTurici_base_64);
  expect(versionHandler.parser(base64)).toEqual(lucernaeTurici_result);
  const result = versionHandler.updater(stateData, valueToUpdate);
  expect(getBase64String(result)).toEqual(lucernae_updated_base_64);
  expect(result).toMatchObject(lucernaeTurici_updated_results);
  expect(versionHandler.parser(getBase64String(result))).toMatchObject(lucernaeTurici_updated_results);
});
