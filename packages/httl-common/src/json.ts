export class Json {
  public static isValid(data: any): boolean {
    try {
      JSON.parse(data);
      return true;
    } catch {
      return false;
    }
  }
}
