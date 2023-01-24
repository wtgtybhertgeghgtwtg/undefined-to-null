import {nullToUndefined} from '../source/index.js';

describe('nullToUndefined', () => {
  it('throws if `input` is not an object.', () => {
    // @ts-expect-error
    expect(() => nullToUndefined(undefined)).toThrowError(
      '"input" must be an object.',
    );

    // @ts-expect-error
    expect(() => nullToUndefined(null)).toThrowError(
      '"input" must be an object.',
    );

    // @ts-expect-error
    expect(() => nullToUndefined(0)).toThrowError('"input" must be an object.');

    // @ts-expect-error
    expect(() => nullToUndefined(1)).toThrowError('"input" must be an object.');

    // @ts-expect-error
    expect(() => nullToUndefined('')).toThrowError(
      '"input" must be an object.',
    );

    // @ts-expect-error
    expect(() => nullToUndefined('1')).toThrowError(
      '"input" must be an object.',
    );
  });

  it('converts top-level null properties to undefined.', () => {
    const input = {
      bar: null as string | null,
      bat: 0,
      baz: undefined,
      foo: null,
      whateverComesAfterBat: '',
    };

    const output = nullToUndefined(input);
    expect(output).toHaveProperty('bar');
    expect(output.bar).toBeUndefined();
    expect(output.bat).toEqual(input.bat);
    expect(output).toHaveProperty('baz');
    expect(output.baz).toBeUndefined();
    expect(output).toHaveProperty('foo');
    expect(output.foo).toBeUndefined();
    expect(output.whateverComesAfterBat).toEqual(input.whateverComesAfterBat);
  });

  it('does not convert deep null properties to undefined if `recursive` is not set.', () => {
    const input = {
      foo: {
        bar: null,
        baz: {
          bat: null,
        },
      },
      whateverComesAfterBat: '',
    };

    const output = nullToUndefined(input);
    expect(output.foo.bar).toBeNull();
    expect(output.foo.baz.bat).toBeNull();
    expect(output.whateverComesAfterBat).toEqual(input.whateverComesAfterBat);
  });

  it('does not convert deep null properties to undefined if `recursive` is undefined.', () => {
    const input = {
      foo: {
        bar: null,
        baz: {
          bat: null,
        },
      },
      whateverComesAfterBat: '',
    };

    const output = nullToUndefined(input, undefined);
    expect(output.foo.bar).toBeNull();
    expect(output.foo.baz.bat).toBeNull();
    expect(output.whateverComesAfterBat).toEqual(input.whateverComesAfterBat);
  });

  it('does not convert deep null properties to undefined if `recursive` is false.', () => {
    const input = {
      foo: {
        bar: null,
        baz: {
          bat: null,
        },
      },
      whateverComesAfterBat: '',
    };

    const output = nullToUndefined(input);
    expect(output.foo.bar).toBeNull();
    expect(output.foo.baz.bat).toBeNull();
    expect(output.whateverComesAfterBat).toEqual(input.whateverComesAfterBat);
  });

  it('does convert deep null properties to undefined if `recursive` is true.', () => {
    const input = {
      foo: {
        bar: null,
        baz: {
          bat: null,
        },
      },
      whateverComesAfterBat: '',
    };

    const output = nullToUndefined(input, true);
    expect(output.foo).toHaveProperty('bar');
    expect(output.foo.bar).toBeUndefined();
    expect(output.foo.baz).toHaveProperty('bat');
    expect(output.foo.baz.bat).toBeUndefined();
    expect(output.whateverComesAfterBat).toEqual(input.whateverComesAfterBat);
  });

  it('works with arrays.', () => {
    const input = [null, 0, '', null, undefined];
    const output = nullToUndefined(input);
    expect(output[0]).toBeUndefined();
    expect(output[1]).toEqual(input[1]);
    expect(output[2]).toEqual(input[2]);
    expect(output[3]).toBeUndefined();
    expect(output[4]).toBeUndefined();
  });

  it('works with arrays recursively.', () => {
    const input = [
      null,
      {
        foo: 3,
        bar: {
          baz: 2,
        },
        bat: [
          null,
          {
            whateverComesAfterBat: null,
            whateverComesAfterThat: {runningOutOfNames: null},
            haveToThinkOfMore: [
              null,
              0,
              {
                justPuttingWhateverComesToMind: [
                  null,
                  {},
                  {atLeastICanRepeatThisOne: null},
                  {atLeastICanRepeatThisOne: {butNotThisOne: null}},
                ],
              },
            ],
          },
          undefined,
        ],
        theseAreMostlyTypeScriptChecks: [
          {inCaseYouCouldNotTell: 4},
          {inCaseYouCouldNotTell: null},
          {inCaseYouCouldNotTell: 5},
          {inCaseYouCouldNotTell: undefined},
        ],
        oneMore: null,
      },
    ] as const;

    const output = nullToUndefined(input, true);
    expect(output[0]).toBeUndefined();
    expect(output[1].foo).toEqual(input[1].foo);
    expect(output[1].bar).toEqual(input[1].bar);
    expect(output[1].bat[0]).toBeUndefined();
    expect(output[1].bat[1].whateverComesAfterBat).toBeUndefined();
    expect(
      output[1].bat[1].whateverComesAfterThat.runningOutOfNames,
    ).toBeUndefined();
    expect(output[1].bat[1].haveToThinkOfMore[0]).toBeUndefined();
    expect(output[1].bat[1].haveToThinkOfMore[1]).toEqual(
      input[1].bat[1].haveToThinkOfMore[1],
    );
    expect(
      output[1].bat[1].haveToThinkOfMore[2].justPuttingWhateverComesToMind[0],
    ).toBeUndefined();
    expect(
      output[1].bat[1].haveToThinkOfMore[2].justPuttingWhateverComesToMind[1],
    ).toEqual(
      input[1].bat[1].haveToThinkOfMore[2].justPuttingWhateverComesToMind[1],
    );
    expect(
      output[1].bat[1].haveToThinkOfMore[2].justPuttingWhateverComesToMind[2]
        .atLeastICanRepeatThisOne,
    ).toBeUndefined();
    expect(
      output[1].bat[1].haveToThinkOfMore[2].justPuttingWhateverComesToMind[3]
        .atLeastICanRepeatThisOne.butNotThisOne,
    ).toBeUndefined();
    expect(output[1].bat[2]).toEqual(input[1].bat[2]);
    expect(output[1].theseAreMostlyTypeScriptChecks[0]).toEqual(
      input[1].theseAreMostlyTypeScriptChecks[0],
    );
    expect(
      output[1].theseAreMostlyTypeScriptChecks[1].inCaseYouCouldNotTell,
    ).toBeUndefined();
    expect(output[1].theseAreMostlyTypeScriptChecks[2]).toEqual(
      input[1].theseAreMostlyTypeScriptChecks[2],
    );
    expect(output[1].theseAreMostlyTypeScriptChecks[3]).toEqual(
      input[1].theseAreMostlyTypeScriptChecks[3],
    );
    expect(output[1].oneMore).toBeUndefined();
  });
});
