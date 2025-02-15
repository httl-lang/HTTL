import chalk from "chalk";
import Httl from "httl-core";
import ora from "ora";
import cliSpinners from 'cli-spinners';
import { CommandProps, IProgramCommand, ProgramArgs } from "../../types";
import { exit } from "process";
import { JsonFormater } from "./json-formater";

interface RequestCommandOptions {
  json: string;
  formdata: string;
  urlencoded: string;
  raw: string;
}

export class RequestCommand implements IProgramCommand {
  private static headerRegexp = /^([\w-]+):\s*(.*)$/

  private static bodyFormats = [
    'json', 'formdata', 'urlencoded', 'raw'
  ];

  private static methods = [
    'get', 'post', 'put', 'delete', 'patch', 'head', 'options',
    'connect', 'trace', 'lock', 'unlock', 'propfind', 'proppatch',
    'copy', 'move', 'mkcol', 'mkcalendar', 'acl', 'search'
  ];

  public parse(args: ProgramArgs): CommandProps {
    if (!RequestCommand.methods.includes(args.arguments[0].toLowerCase()))
      return undefined;

    const requestArgs = args.arguments.slice(2);

    const headers = requestArgs.filter(arg => RequestCommand.headerRegexp.test(arg)).reduce((acc, curr) => {
      const [key, value] = curr.split(":");
      acc[key] = value;
      return acc;
    }, {});

    const restArgs = requestArgs.filter(arg => !RequestCommand.headerRegexp.test(arg));

    if (restArgs.length > 1) {
      console.error(`Invalid arguments: ${restArgs.join(" ")}`);
      process.exit(1);
    }

    let body = restArgs[0];
    let format = undefined;

    const options = Object.entries(args.options);
    if (options.length > 1) {
      console.error(`Invalid multiple options: ${Object.keys(args.options).join(" ")}`);
      process.exit(1);
    }

    if (options.length === 1) {
      const [key, value] = options[0];

      if (body) {
        console.error(`Invalid multiple body: ${body} and ${key} ${value}`);
        process.exit(1);
      }

      if (!RequestCommand.bodyFormats.includes(key)) {
        console.error(`Invalid body format: ${key}`);
        process.exit(1);
      }

      format = key;

      if (format === 'raw') {
        body = `"${value}"`;
      } else {
        body = value;
      }
    }

    return {
      method: args.arguments[0],
      url: args.arguments[1],
      headers,
      body,
      format
    }
  }

  public async run({ method, url, headers, body, format }): Promise<void> {
    const spinner = ora({
      spinner: cliSpinners.dotsCircle,
      text: chalk.dim(" Loading...")
    }).start();

    try {
      const httl = new Httl({
        workdir: process.cwd()
      });

      const headersString = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join("\n");
      const bodyString = format ? `${format} ${body}` : body;

      const script = `${method} ${url}\n${headersString}\n${bodyString}`;

      const result = await httl
        .createDocument(script)
        .run();

      const output = result.toOutput();

      if (output.errors.length) {
        console.error(JSON.stringify(output.errors, null, 2));
        process.exit(1);
      }

      spinner.stop();

      const response = output.result.at(-1);

      console.log(chalk.bgCyan(`HTTP/${response.httpVersion} ${response.statusCode} ${response.statusMessage}`));

      response.res.headers.forEach(([key, value]) => {
        process.stdout.write(chalk.green(`${key}: `));
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

      if (lang === 'json') {
        // walkJSON2(JSON.parse(response.res.data));
        JsonFormater.format(sample);
      } else {
        console.log(chalk.cyan(`${response.res.data}`));
      }
    } catch (error) {
      spinner.stop();
      console.error(error);
      exit(1);
    }
  }
}

const sample = {
  "args": {},
  "data": [1, 2, 4],
  "files": [
    {
      "field": "file",
      "name": "file.txt",
      "type": "text/plain",
      "value": "file content"
    },
    {
      "field": "file",
      "name": "file2.txt",
      "type": "text/plain",
      "value": "file content"
    }
  ],
  "form": {},
  "headers": {
    "Accept": "application/json, */*;q=0.5",
    "Accept-Encoding": "gzip, deflate",
    "Content-Length": "36",
    "Content-Type": "application/json",
    "Gopa": "sysya",
    "Gopa2": "pysa gopovna",
    "Host": "httpbin.org",
    "User-Agent": "HTTPie/3.2.2",
    "X-Amzn-Trace-Id": "Root=1-67afbfd1-0b8f327e6d7426703256ae83"
  },
  "origin": "135.23.178.105",
  "url": "http://httpbin.org/delay/1"
};
