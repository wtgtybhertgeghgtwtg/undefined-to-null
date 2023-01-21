import { nullToUndefined } from '../source/index.js';
describe('nullToUndefined', () => {
    it('throws if `input` is not an object.', () => {
        // @ts-expect-error
        expect(() => nullToUndefined(undefined)).toThrowError('"input" must be an object.');
        // @ts-expect-error
        expect(() => nullToUndefined(null)).toThrowError('"input" must be an object.');
        // @ts-expect-error
        expect(() => nullToUndefined(0)).toThrowError('"input" must be an object.');
        // @ts-expect-error
        expect(() => nullToUndefined(1)).toThrowError('"input" must be an object.');
        // @ts-expect-error
        expect(() => nullToUndefined('')).toThrowError('"input" must be an object.');
        // @ts-expect-error
        expect(() => nullToUndefined('1')).toThrowError('"input" must be an object.');
    });
    it('converts top-level null properties to undefined.', () => {
        const input = {
            bar: null,
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
});
