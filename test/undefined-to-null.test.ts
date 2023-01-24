import {undefinedToNull} from '../source/index.js';

describe('undefinedToNull', () => {
  it('throws if `input` is not an object.', () => {
    // @ts-expect-error
    expect(() => undefinedToNull(undefined)).toThrowError(
      '"input" must be an object.',
    );

    // @ts-expect-error
    expect(() => undefinedToNull(null)).toThrowError(
      '"input" must be an object.',
    );

    // @ts-expect-error
    expect(() => undefinedToNull(0)).toThrowError('"input" must be an object.');

    // @ts-expect-error
    expect(() => undefinedToNull(1)).toThrowError('"input" must be an object.');

    // @ts-expect-error
    expect(() => undefinedToNull('')).toThrowError(
      '"input" must be an object.',
    );

    // @ts-expect-error
    expect(() => undefinedToNull('1')).toThrowError(
      '"input" must be an object.',
    );
  });

  it('converts top-level undefined properties to null.', () => {
    const input = {
      bar: undefined,
      bat: 0,
      baz: null,
      foo: undefined,
      whateverComesAfterBat: '',
      whateverComesAfterThat: null,
    };

    const output = undefinedToNull(input);
    expect(output.bar).toBeNull();
    expect(output.bat).toEqual(input.bat);
    expect(output.baz).toBeNull();
    expect(output.foo).toBeNull();
    expect(output.whateverComesAfterBat).toEqual(input.whateverComesAfterBat);
    expect(output.whateverComesAfterThat).toBeNull();
  });

  it('does not convert deep undefined properties to null if `recursive` is not set.', () => {
    const input = {
      foo: {
        bar: undefined,
        baz: {
          bat: undefined,
        },
      },
      whateverComesAfterBat: '',
      whateverComesAfterThat: null,
    };

    const output = undefinedToNull(input);
    expect(output.foo.bar).toBeUndefined();
    expect(output.foo.baz.bat).toBeUndefined();
    expect(output.whateverComesAfterBat).toEqual(input.whateverComesAfterBat);
    expect(output.whateverComesAfterThat).toBeNull();
  });

  it('does not convert deep undefined properties to null if `recursive` is undefined.', () => {
    const input = {
      foo: {
        bar: undefined,
        baz: {
          bat: undefined,
        },
      },
      whateverComesAfterBat: '',
      whateverComesAfterThat: null,
    };

    const output = undefinedToNull(input, undefined);
    expect(output.foo.bar).toBeUndefined();
    expect(output.foo.baz.bat).toBeUndefined();
    expect(output.whateverComesAfterBat).toEqual(input.whateverComesAfterBat);
    expect(output.whateverComesAfterThat).toBeNull();
  });

  it('does not convert deep undefined properties to null if `recursive` is false.', () => {
    const input = {
      foo: {
        bar: undefined,
        baz: {
          bat: undefined,
        },
      },
      whateverComesAfterBat: '',
      whateverComesAfterThat: null,
    };

    const output = undefinedToNull(input, false);
    expect(output.foo.bar).toBeUndefined();
    expect(output.foo.baz.bat).toBeUndefined();
    expect(output.whateverComesAfterBat).toEqual(input.whateverComesAfterBat);
    expect(output.whateverComesAfterThat).toBeNull();
  });

  it('does convert deep undefined properties to null if `recursive` is true.', () => {
    const input = {
      foo: {
        bar: undefined,
        baz: {
          bat: undefined,
        },
      },
      whateverComesAfterBat: '',
      whateverComesAfterThat: null,
    };

    const output = undefinedToNull(input, true);
    expect(output.foo.bar).toBeNull();
    expect(output.foo.baz.bat).toBeNull();
    expect(output.whateverComesAfterBat).toEqual(input.whateverComesAfterBat);
    expect(output.whateverComesAfterThat).toBeNull();
  });

  it('works with arrays.', () => {
    const input = [undefined, 0, '', undefined, null];
    const output = undefinedToNull(input);
    expect(output[0]).toBeNull();
    expect(output[1]).toEqual(input[1]);
    expect(output[2]).toEqual(input[2]);
    expect(output[3]).toBeNull();
    expect(output[4]).toBeNull();
  });

  it('works with arrays recursively.', () => {
    const input = [
      undefined,
      {
        foo: 3,
        bar: {
          baz: 2,
        },
        bat: [
          undefined,
          {
            whateverComesAfterBat: undefined,
            whateverComesAfterThat: {runningOutOfNames: undefined},
            haveToThinkOfMore: [
              undefined,
              0,
              {
                justPuttingWhateverComesToMind: [
                  undefined,
                  {},
                  {atLeastICanRepeatThisOne: undefined},
                  {atLeastICanRepeatThisOne: {butNotThisOne: undefined}},
                ],
              },
            ],
          },
          null,
        ],
        theseAreMostlyTypeScriptChecks: [
          {inCaseYouCouldNotTell: 4},
          {inCaseYouCouldNotTell: undefined},
          {inCaseYouCouldNotTell: 5},
          {inCaseYouCouldNotTell: null},
        ],
        oneMore: undefined,
      },
    ] as const;

    const output = undefinedToNull(input, true);
    expect(output[0]).toBeNull();
    expect(output[1].foo).toEqual(input[1].foo);
    expect(output[1].bar).toEqual(input[1].bar);
    expect(output[1].bat[0]).toBeNull();
    expect(output[1].bat[1].whateverComesAfterBat).toBeNull();
    expect(
      output[1].bat[1].whateverComesAfterThat.runningOutOfNames,
    ).toBeNull();
    expect(output[1].bat[1].haveToThinkOfMore[0]).toBeNull();
    expect(output[1].bat[1].haveToThinkOfMore[1]).toEqual(
      input[1].bat[1].haveToThinkOfMore[1],
    );
    expect(
      output[1].bat[1].haveToThinkOfMore[2].justPuttingWhateverComesToMind[0],
    ).toBeNull();
    expect(
      output[1].bat[1].haveToThinkOfMore[2].justPuttingWhateverComesToMind[1],
    ).toEqual(
      input[1].bat[1].haveToThinkOfMore[2].justPuttingWhateverComesToMind[1],
    );
    expect(
      output[1].bat[1].haveToThinkOfMore[2].justPuttingWhateverComesToMind[2]
        .atLeastICanRepeatThisOne,
    ).toBeNull();
    expect(
      output[1].bat[1].haveToThinkOfMore[2].justPuttingWhateverComesToMind[3]
        .atLeastICanRepeatThisOne.butNotThisOne,
    ).toBeNull();
    expect(output[1].bat[2]).toEqual(input[1].bat[2]);
    expect(output[1].theseAreMostlyTypeScriptChecks[0]).toEqual(
      input[1].theseAreMostlyTypeScriptChecks[0],
    );
    expect(
      output[1].theseAreMostlyTypeScriptChecks[1].inCaseYouCouldNotTell,
    ).toBeNull();
    expect(output[1].theseAreMostlyTypeScriptChecks[2]).toEqual(
      input[1].theseAreMostlyTypeScriptChecks[2],
    );
    expect(output[1].theseAreMostlyTypeScriptChecks[3]).toEqual(
      input[1].theseAreMostlyTypeScriptChecks[3],
    );
    expect(output[1].oneMore).toBeNull();
  });
});
