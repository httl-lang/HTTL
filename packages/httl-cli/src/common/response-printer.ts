import { HttpResponse } from "httl-core";
import { JsonPrinter } from "./json-printer";
import chalk from "chalk";
import { Json } from "httl-common";

export class ResponsePrinter {

  public static print(response: HttpResponse) {
    const CODE_COLORS = {
      "1xx": { backgroundColor: '#007BFF', color: '#000000' }, //  Informational	Blue
      "2xx": { backgroundColor: '#00881e', color: '#fff' }, // Success		
      "3xx": { backgroundColor: '#ff8000', color: '#000000' }, // Redirection	
      "4xx": { backgroundColor: '#DC3545', color: '#fff' }, // Client Error
      "5xx": { backgroundColor: '#6d192a', color: '#ff4242' }, // Server Error
      "default": { backgroundColor: '#6C757D', color: '#000000' },
    }

    const color = CODE_COLORS[response.statusCode.toString()[0] + 'xx'] || CODE_COLORS.default;
    console.log(chalk.bgHex(color.backgroundColor).hex(color.color).bold(` HTTP/${response.httpVersion} ${response.statusCode} ${response.statusMessage} `));

    response.res.headers.forEach(([key, value]) => {
      process.stdout.write(chalk.green(`${key}`));
      process.stdout.write(`: `);
      process.stdout.write(`${value}\n`);
    });

    if (response.res.headers.length > 0) {
      process.stdout.write("\n");
    }

    const lang =
      response.res.headers.some(([key, value]) => key.toLowerCase() === 'content-type' && value.includes('xml'))
        ? 'xml'
        : response.res.headers.some(([key, value]) => key.toLowerCase() === 'content-type' && value.includes('html'))
          ? 'html'
          : 'json';

    if (lang === 'json' && Json.isValid(response.res.data)) {
      JsonPrinter.print(JSON.parse(response.res.data));
    } else {
      console.log(chalk.cyan(`${response.res.data}`));
    }
  }
}