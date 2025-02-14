import chalk from "chalk";
import Httl from "httl-core";
import ora from "ora";
import cliSpinners from 'cli-spinners';
import { IProgramCommand, ProgramArgs } from "../../types";

export class RequestCommand implements IProgramCommand {
  private static methods = [
    'get', 'post', 'put', 'delete', 'patch', 'head', 'options',
    'connect', 'trace', 'lock', 'unlock', 'propfind', 'proppatch',
    'copy', 'move', 'mkcol', 'mkcalendar', 'acl', 'search'
  ];

  public test(args: ProgramArgs): boolean {
    return RequestCommand.methods.includes(args.args[0].toLowerCase());
  }

  public async run(method, url, headersAndBody, options): Promise<void> {
    const spinner = ora({ spinner: cliSpinners.dotsCircle, text: chalk.dim(" Loading...") }).start();

    // console.log(chalk.blue("gopa", headersAndBody));
    const httl = new Httl({
      workdir: process.cwd()
    });

    const result = await httl
      .createDocument(`${method} ${url}`)
      .run();

    const output = result.toOutput();
    if (output.errors.length) {
      console.error(JSON.stringify(output.errors, null, 2));
      process.exit(1);
    }

    spinner.stop();
    // process.stdout.write('\x1Bc');
    // process.stdout.moveCursor(0, -1); // Move cursor up one line
    // process.stdout.clearLine(1);   

    console.log(output.result.at(-1).res.data);
  }
}