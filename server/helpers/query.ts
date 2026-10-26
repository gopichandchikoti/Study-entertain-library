/** A query-string value only when it is a single string; arrays and objects are rejected. */
export const queryValue = (value: unknown): string | null => (typeof value === 'string' ? value : null)
