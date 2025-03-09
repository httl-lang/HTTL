export class Json {
  public static isValid(data: any): boolean {
    try {
      JSON.parse(data);
      return true;
    } catch {
      return false;
    }
  }

  public static safeParse(data: string): any {
    try {
      return JSON.parse(data);
    } catch {
      return undefined;
    }
  }
}
