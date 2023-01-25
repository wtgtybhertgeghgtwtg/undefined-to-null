type InputMapper = <Input extends object, Recursive extends boolean>(
  input: Input,
  recursive: Recursive,
  // I really don't like this, but I can't think of a better way at the moment.
  // Maybe if TypeScript had higher order types.
) => {[Key in keyof Input]: any};

type ValueMapper = <Value, Recursive extends boolean>(
  value: Value,
  recursive: Recursive,
) => unknown;

export default function createInputMapper(
  valueMapper: ValueMapper,
): InputMapper {
  return function inputMapper<Input extends object, Recursive extends boolean>(
    input: Input,
    recursive: Recursive,
  ) {
    if (Array.isArray(input)) {
      return input.map((value) => valueMapper(value, recursive));
    }

    const entries = Object.entries(input).map(([key, value]) => [
      key,
      valueMapper(value, recursive),
    ]);

    return Object.fromEntries(entries);
  };
}
