/**
 * A version of an object with its undefined properties converted to null.
 * @typeParam Input - The type of the input object.
 * @typeParam Recursive - Whether the type is recursively converted.
 */
export type UndefinedToNull<
  Input extends object,
  Recursive extends boolean = false,
> = {
  [key in keyof Input]: undefined extends Input[key]
    ? Exclude<Input[key], undefined> | null
    : Input[key] extends object
    ? Recursive extends true
      ? UndefinedToNull<Input, Recursive>
      : Input
    : Input[key];
};

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
  [key in keyof Input]: undefined extends Input[key]
    ? Exclude<Input[key], undefined> | null
    : Input[key];
};

function undefinedToNull<Input extends object>(
  input: Input,
  recursive: true,
): {
  [key in keyof Input]: undefined extends Input[key]
    ? Exclude<Input[key], undefined> | null
    : Input[key] extends object
    ? {
        [key1 in keyof Input[key]]: undefined extends Input[key][key1]
          ? Exclude<Input[key][key1], undefined> | null
          : Input[key][key1] extends object
          ? {
              [key2 in keyof Input[key][key1]]: undefined extends Input[key][key1][key2]
                ? Exclude<Input[key][key1][key2], undefined> | null
                : Input[key][key1][key2] extends object
                ? UndefinedToNull<Input[key][key1][key2], true>
                : Input[key][key1][key2];
            }
          : Input[key][key1];
      }
    : Input[key];
};

function undefinedToNull<Input extends object>(
  input: Input,
  recursive: boolean = false,
): UndefinedToNull<Input, boolean> {
  if (!input || typeof input !== 'object') {
    throw new TypeError('"input" must be an object.');
  }

  const entries = Object.entries(input).map(([key, value]) => [
    key,
    value === undefined
      ? null
      : recursive && value && typeof value === 'object'
      ? undefinedToNull(value, true)
      : value,
  ]);

  return Object.fromEntries(entries);
}

export default undefinedToNull;
