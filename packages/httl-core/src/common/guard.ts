export class Guard {
  public static notNull(obj: any, name: string) {
    if (obj === null || obj === undefined) {
      throw new Error(`${name} must not be null`);
    }
  }

  public static isNull(obj: any, name: string) {
    if (!obj === null || !obj === undefined) {
      throw new Error(`${name} is already set`);
    }
  }

  public static notEmptyString(value: any) {
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error('Value must be a non-empty string');
    }
  }
}