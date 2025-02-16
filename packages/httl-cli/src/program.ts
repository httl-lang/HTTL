import { RequestCommand } from "./commands/request";
import { RunCommand } from "./commands/run";
import { IProgramCommand, ProgramArgs } from './types';

export class Program {
  private readonly args: ProgramArgs;
  private readonly commands: IProgramCommand[] = [
    new RunCommand(),
    new RequestCommand(),
  ]

  constructor(
    args: string[],
  ) {
    const cliArgs = {
      arguments: [],
      options: {}
    }

    for (let i = 2; i < args.length; i++) {
      const argument = args[i];
      if (argument.startsWith("--")) {
        cliArgs.options[argument.slice(2)] = args[++i];
      } else {
        cliArgs.arguments.push(argument);
      }
    }

    this.args = {
      nodePath: args[0],
      scriptPath: args[1],
      ...cliArgs,
    }
  }

  async parse() {
    for (const command of this.commands) {
      const parsed = command.parse(this.args) as IProgramCommand;
      if (parsed !== undefined) {
        await command.run(parsed);
        return;
      }
    }

    console.log(`Command not found for ${this.args}`);
    process.exit(1);
  }
}