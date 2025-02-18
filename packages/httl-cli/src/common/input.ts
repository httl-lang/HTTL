export class Input {

  public static hasRedirection() {
    return !process.stdin.isTTY;
  }

  public static async read() {
    return new Promise<string>((resolve, reject) => {
      let data = '';
      process.stdin.on('data', (chunk) => {
        data += chunk;
      });

      process.stdin.on('end', () => {
        resolve(data);
      });

      process.stdin.on('error', (err) => {
        reject(err);
      });
    });
  }
}