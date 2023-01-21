function undefinedToNull(input, recursive = false) {
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
