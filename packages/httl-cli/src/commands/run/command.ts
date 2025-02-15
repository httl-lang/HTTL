import chalk from "chalk";
import Httl from "httl-core";
import ora from "ora";
import cliSpinners from 'cli-spinners';
import { CommandProps, IProgramCommand, ProgramArgs } from "../../types";


export class RunCommand implements IProgramCommand {

  public parse(args: ProgramArgs): CommandProps {
    if (args.arguments.length !== 1)
      return undefined;

    return {
      file: args.arguments[0],
    }
  }

  public async run({ file }): Promise<void> {
    const spinner = ora({ spinner: cliSpinners.dotsCircle, text: chalk.dim(" Loading...") }).start();

    // // console.log(chalk.blue("gopa", headersAndBody));
    // const httl = new Httl({
    //   workdir: process.cwd()
    // });

    // const result = await httl
    //   .createDocument(`${method} ${url}`)
    //   .run();

    // const output = result.toOutput();
    // if (output.errors.length) {
    //   console.error(JSON.stringify(output.errors, null, 2));
    //   process.exit(1);
    // }

    setTimeout(() => {
      spinner.stop();
    }, 1000);


    // process.stdout.write('\x1Bc');
    // process.stdout.moveCursor(0, -1); // Move cursor up one line
    // process.stdout.clearLine(1);   

    // console.log(output.result.at(-1).res.data);
  }
}