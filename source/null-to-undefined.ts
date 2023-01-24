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
