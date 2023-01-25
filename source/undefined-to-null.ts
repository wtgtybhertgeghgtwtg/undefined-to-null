import createInputMapper from './create-input-mapper.js';

type TrimUndefined<Input, Recursive extends boolean> = undefined extends Input
  ? Exclude<
      Input extends object
        ? {
            [Key in keyof UndefinedToNull<Input, Recursive>]: UndefinedToNull<
              Input,
              Recursive
            >[Key];
          }
        : Input,
      undefined
    > | null
  : Input extends object
  ? Recursive extends true
    ? Input extends Array<infer Value>
      ? TrimUndefined<Value, Recursive>[]
      : {
          [Key in keyof UndefinedToNull<Input, Recursive>]: UndefinedToNull<
            Input,
            Recursive
          >[Key];
        }
    : Input
  : Input;

/**
 * A version of an object with its undefined properties converted to null.
 * @typeParam Input - The type of the input object.
 * @typeParam Recursive - Whether the type is recursively converted.
 */
export type UndefinedToNull<
  Input extends object,
  Recursive extends boolean = false,
> = {
  [Key in keyof Input]: TrimUndefined<Input[Key], Recursive>;
};

const inputMapper = createInputMapper((input, recursive) => {
  if (input === undefined) {
    return null;
  }

  if (!recursive || input === null || typeof input !== 'object') {
    return input;
  }

  return inputMapper(input, true);
});

/**
 * Convert the undefined properties of an object to null.
 *
 * @param input - The input object whose undefined properties will be converted to null.
 * @param recursive - Whether to recursively convert undefined properties to null.
 */
function undefinedToNull<Input extends object>(
  input: Input,
  recursive?: boolean,
): {
  [Key in keyof Input]: UndefinedToNull<Input, false>[Key];
};

function undefinedToNull<Input extends object>(
  input: Input,
  recursive: true,
): {
  [Key in keyof Input]: UndefinedToNull<Input, true>[Key];
};

function undefinedToNull<Input extends object>(
  input: Input,
  recursive: boolean = false,
): UndefinedToNull<Input, boolean> {
  if (input === null || typeof input !== 'object') {
    throw new TypeError('"input" must be an object.');
  }

  return inputMapper(input, recursive);
}

export default undefinedToNull;
