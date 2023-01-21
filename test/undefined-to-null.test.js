import { undefinedToNull } from '../source/index.js';
describe('undefinedToNull', () => {
    it('throws if `input` is not an object.', () => {
        // @ts-expect-error
        expect(() => undefinedToNull(undefined)).toThrowError('"input" must be an object.');
        // @ts-expect-error
        expect(() => undefinedToNull(null)).toThrowError('"input" must be an object.');
        // @ts-expect-error
        expect(() => undefinedToNull(0)).toThrowError('"input" must be an object.');
        // @ts-expect-error
        expect(() => undefinedToNull(1)).toThrowError('"input" must be an object.');
        // @ts-expect-error
        expect(() => undefinedToNull('')).toThrowError('"input" must be an object.');
        // @ts-expect-error
        expect(() => undefinedToNull('1')).toThrowError('"input" must be an object.');
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
});
