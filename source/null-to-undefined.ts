import createInputMapper from './create-input-mapper.js';

type TrimNull<Input, Recursive extends boolean> = null extends Input
  ?
      | Exclude<
          Input extends object
            ? {
                [Key in keyof NullToUndefined<
                  Input,
                  Recursive
                >]: NullToUndefined<Input, Recursive>[Key];
              }
            : Input,
          null
        >
      | undefined
  : Input extends object
  ? Recursive extends true
    ? Input extends Array<infer Value>
      ? TrimNull<Value, Recursive>[]
      : {
          [Key in keyof NullToUndefined<Input, Recursive>]: NullToUndefined<
            Input,
            Recursive
          >[Key];
        }
    : Input
  : Input;

/**
 * A version of an object with its null properties converted to undefined.
 * @typeParam Input - The type of the input object.
 * @typeParam Recursive - Whether the type is recursively converted.
 */
export type NullToUndefined<
  Input extends object,
  Recursive extends boolean = false,
> = {
  [Key in keyof Input]: TrimNull<Input[Key], Recursive>;
};

const inputMapper = createInputMapper((input, recursive) => {
  if (input === null) {
    return undefined;
  }

  if (!recursive || typeof input !== 'object') {
    return input;
  }

  return inputMapper(input, true);
});

/**
 * Convert the null properties of an object to undefined.
 *
 * @param input - The input object whose null properties will be converted to undefined.
 * @param recursive - Whether to recursively convert null properties to undefined.
 */
function nullToUndefined<Input extends object>(
  input: Input,
  recursive?: boolean,
): {[Key in keyof Input]: NullToUndefined<Input, false>[Key]};

function nullToUndefined<Input extends object>(
  input: Input,
  recursive: true,
): {[Key in keyof Input]: NullToUndefined<Input, true>[Key]};

function nullToUndefined<Input extends object>(
  input: Input,
  recursive: boolean = false,
): NullToUndefined<Input, boolean> {
  if (!input || typeof input !== 'object') {
    throw new TypeError('"input" must be an object.');
  }

  return inputMapper(input, recursive);
}

export default nullToUndefined;
