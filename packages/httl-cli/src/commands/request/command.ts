import chalk from "chalk";
import Httl from "httl-core";
import ora from "ora";
import cliSpinners from 'cli-spinners';
import { CommandProps, IProgramCommand } from "../../types";
import { exit } from "process";
import { ResponsePrinter } from "../../common/response-printer";
import { Input } from "../../common/input";
import { Option, Param, ProgramArgs } from "../../common/program-args";

interface RequestCommandOptions {
  json: string;
  formdata: string;
  urlencoded: string;
  raw: string;
}

class RequestCommandArgs {
  public static bodyFormats = [
    'json', 'formdata', 'urlencoded', 'raw'
  ];

  public static methods = [
    'get', 'post', 'put', 'delete', 'patch', 'head', 'options',
    'connect', 'trace', 'lock', 'unlock', 'propfind', 'proppatch',
    'copy', 'move', 'mkcol', 'mkcalendar', 'acl', 'search'
  ];

  public headers: { key: string, value: string }[] = [];
  public options: Option[] = [];
  public body: string;
  public format: string;

  constructor(
    public readonly method: string,
    public readonly url: string,
    public readonly hasRedirection: boolean
  ) { }

  public addHeader(key: string, value: string) {
    this.headers.push({ key, value });
  }

  public setBody(value: any) {
    if (value === undefined) {
      return;
    }

    if (this.body !== undefined) {
      console.error('Cannot set body multiple times');
      process.exit(1);
    }

    this.body = value;

    if (this.format === undefined) {
      try {
        JSON.parse(value);
      } catch {
        this.format = 'raw';
      }
    }

    if (this.format === 'raw') {
      this.body = `"${value.replace(/"/g, '\\"')}"`;
    }
  }

  public setOption(key: string, value: string) {
    if (RequestCommandArgs.bodyFormats.includes(key)) {
      this.format = key;
      this.setBody(value);
      return;
    }

    console.error(`Invalid option: --${key}`);
    process.exit(1);
  }
}

export class RequestCommand implements IProgramCommand {
  private static headerRegexp = /^([\w-]+):\s*(.*)$/

  public async parse(args: ProgramArgs): Promise<CommandProps> {
    const programArgs = args.clone();

    const method = programArgs.consume();
    if (!RequestCommandArgs.methods.includes(method.value.toLowerCase()))
      return undefined;

    const url = programArgs.consume();
    if (url === undefined) {
      console.error(`Invalid URL: ${url}`);
      process.exit(1);
    }

    const commandArgs = new RequestCommandArgs(
      method.value,
      url.value,
      Input.hasRedirection()
    );

    programArgs.consumeEach(arg => {
      if (arg instanceof Param) {
        if (RequestCommand.headerRegexp.test(arg.value)) {
          const [key, value] = arg.value.split(":");
          commandArgs.addHeader(key, value);
          return;
        }

        if (commandArgs.body === undefined) {
          commandArgs.setBody(arg.value);
          return;
        }
      }

      if (arg instanceof Option) {
        commandArgs.setOption(arg.key.toLowerCase(), arg.value);
        return;
      }

      console.error(`Invalid argument: \`${arg.value}\``);
      process.exit(1);
    });

    if (Input.hasRedirection()) {
      commandArgs.setBody(
        await Input.read()
      );
    }

    return commandArgs;
  }

  public async run({ method, url, headers, body, format }: RequestCommandArgs): Promise<void> {
    const spinner = ora({
      spinner: cliSpinners.dotsCircle,
      text: chalk.dim(" Loading...")
    }).start();

    try {
      const httl = new Httl({
        workdir: process.cwd()
      });

      let actualBody = body ?? '';
     

      const headersString = headers.map(({ key, value }) => `${key}: ${value}`).join("\n");
      const bodyString = format ? `${format} ${actualBody}` : actualBody;

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

      ResponsePrinter.print(response);
    } catch (error) {
      spinner.stop();
      console.error(error);
      exit(1);
    }
  }
}