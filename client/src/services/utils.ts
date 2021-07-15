export function groupBy<T, K>(xs: T[], keySelector: (x: T) => K): Map<K, T[]> {
  const result = new Map<K, T[]>();
  for (const x of xs) {
    const key = keySelector(x);
    let values = result.get(key);
    if (!values) {
      values = [];
      result.set(key, values);
    }
    values.push(x);
  }
  return result;
}