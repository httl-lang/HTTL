export function merge<T>(a: T, b: Partial<T>): T {
  for (const key in b) {
    if (b.hasOwnProperty(key)) {
      const element = b[key];
      if (element === undefined) {
        delete a[key];
      } else if (typeof element === 'object') {
        a[key] ??= {} as any;
        a[key] = merge(a[key], element);
      } else {
        a[key] = element;
      }
    }
  }

  return a;
}