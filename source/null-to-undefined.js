function nullToUndefined(input, recursive = false) {
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
