/**
 * A version of an object with its null properties converted to undefined.
 * @typeParam Input - The type of the input object.
 * @typeParam Recursive - Whether the type is recursively converted.
 */
export type NullToUndefined<
  Input extends object,
  Recursive extends boolean = false,
> = {
  [key in keyof Input]: null extends Input[key]
    ? Exclude<Input[key], null> | undefined
    : Input[key] extends object
    ? Recursive extends true
      ? NullToUndefined<Input, Recursive>
      : Input
    : Input[key];
};

/**
 * Convert the null properties of an object to undefined.
 *
 * @param input - The input object whose null properties will be converted to undefined.
 * @param recursive - Whether to recursively convert null properties to undefined.
 */
function nullToUndefined<Input extends object>(
  input: Input,
  recursive?: boolean,
): {
  [key in keyof Input]: null extends Input[key]
    ? Exclude<Input[key], null> | undefined
    : Input[key];
};

function nullToUndefined<Input extends object>(
  input: Input,
  recursive: true,
): {
  [key in keyof Input]: null extends Input[key]
    ? undefined
    : Input[key] extends object
    ? {
        [key1 in keyof Input[key]]: null extends Input[key][key1]
          ? undefined
          : Input[key][key1] extends object
          ? {
              [key2 in keyof Input[key][key1]]: Input[key][key1][key2] extends null
                ? undefined
                : Input[key][key1][key2] extends object
                ? NullToUndefined<Input[key][key1][key2], true>
                : Input[key][key1][key2];
            }
          : Input[key][key1];
      }
    : Input[key];
};

function nullToUndefined<Input extends object>(
  input: Input,
  recursive: boolean = false,
): NullToUndefined<Input, boolean> {
  if (!input || typeof input !== 'object') {
    throw new TypeError('"input" must be an object.');
  }

  const entries = Object.entries(input).map(([key, value]) => [
    key,
    value === null
      ? undefined
      : recursive && typeof value === 'object'
      ? nullToUndefined(value, true)
      : value,
  ]);

  return Object.fromEntries(entries);
}

export default nullToUndefined;
