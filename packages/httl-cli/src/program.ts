import { RequestCommand } from "./commands/request";
import { RunCommand } from "./commands/run";
import { IProgramCommand, ProgramArgs } from './types';

export class Program {
  private readonly args: ProgramArgs;
  private readonly commands = [
    new RunCommand(),
    new RequestCommand(),
  ]

  constructor(
    args: string[],
  ) {
    this.args = {
      nodePath: args[0],
      scriptPath: args[1],
      args: args.slice(2),
    }
  }

  async parse() {
    const command = this.commands.find(command => command.test(this.args)) as IProgramCommand;
    if (!command) {
      console.log(`Command not found for ${this.args}`);
      process.exit(1);
    }

    await command.run(...this.args.args);
  }
}




// export const cli = program
//   .version(packageJson.version)
//   .description(packageJson.description)

// setRunCommand(cli);
// setRequestCommand(cli);