import { ProgramArgs } from "./common/program-args";

export interface IProgramCommand {
  parse(args: ProgramArgs): Promise<CommandProps>;
  run(props: Record<string, any> | boolean): Promise<void>;
}

export type CommandProps = undefined | boolean | Record<string, any>;
