export function last<T>(value: Array<T>): T | undefined {
  if (!value || value.length === 0) return undefined;
  return value[value.length - 1];
}
