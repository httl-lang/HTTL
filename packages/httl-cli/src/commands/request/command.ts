import chalk from "chalk";
import Httl from "httl-core";
import ora from "ora";
import cliSpinners from 'cli-spinners';
import { CommandProps, IProgramCommand } from "../../types";
import { exit } from "process";
import { ResponsePrinter } from "../../common/response-printer";
import { Input } from "../../common/input";
import { Option, Param, ProgramArgs } from "../../common/program-args";
import { RequestCommandArgs } from "./command-args";

export class RequestCommand implements IProgramCommand {
  private static headerRegexp = /^([\w-]+):\s*(.*)$/

  public async parse(programArgs: ProgramArgs): Promise<CommandProps> {
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