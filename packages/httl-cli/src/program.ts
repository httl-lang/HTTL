import { HelpCommand } from "./commands/help";
import { RequestCommand } from "./commands/request";
import { RunCommand } from "./commands/run";
import { ProgramArgs } from "./common/program-args";
import { IProgramCommand } from './types';

export class Program {
  private readonly rawArgs: string[];
  private readonly args: ProgramArgs;

  private readonly commands: IProgramCommand[] = [
    new HelpCommand(),
    new RunCommand(),
    new RequestCommand(),
  ]

  constructor(args: string[]) {
    this.rawArgs = args;
    this.args = ProgramArgs.parse(args);
  }

  public async start() {
    for (const command of this.commands) {
      const parsed = await command.parse(this.args.clone());
      if (parsed !== undefined) {
        await command.run(parsed);
        return;
      }
    }

    console.error(`Command not found for ${this.rawArgs}`);
    process.exit(1);
  }
}