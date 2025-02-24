import Httl from "httl-core";
import { CommandProps, IProgramCommand } from "../../types";
import { ProgramArgs } from "../../common/program-args";
import { ResponsePrinter } from "../../common/response-printer";
import { exit } from "process";
import { Input } from "../../common/input";
import { Spinner } from "../../common/spinner";
import chalk from "chalk";
import { HttlExecutionError } from "../../common/errors";


export class RunCommand implements IProgramCommand {

  public async parse(programArgs: ProgramArgs): Promise<CommandProps> {
    if (programArgs.paramLength === 1) {
      return {
        file: programArgs.consume().value,
      };
    }

    if (programArgs.paramLength === 0 && Input.hasRedirection()) {
      return {
        script: await Input.read(),
      };
    }
  }

  public async run({ file, script }): Promise<void> {
    const spinner = Spinner.start();

    try {
      const httl = new Httl({
        workdir: process.cwd()
      });

      const httDoc = file
        ? httl.load(file).sync()
        : script
          ? httl.createDocument(script)
          : null;

      if (!httDoc) {
        throw new Error("Invalid input file");
      }

      const result = await httDoc.run();

      const output = result.toOutput();

      if (output.errors.length) {
        throw new HttlExecutionError(output.errors);
      }

      spinner.stop();

      const response = output.result.at(-1);

      ResponsePrinter.print(response);
    } catch (error) {
      spinner.stop();
      console.log(chalk.redBright(error.message));
      exit(1);
    }
  }
}