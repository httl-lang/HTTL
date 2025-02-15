export interface ProgramArgs {
  nodePath: string;
  scriptPath: string;
  arguments: string[];
  options: Record<string, any>;
}

export interface IProgramCommand {
  parse(args: ProgramArgs): CommandProps;
  run(props: Record<string, any>): Promise<void>;
}

export type CommandProps = undefined | Record<string, any>;
