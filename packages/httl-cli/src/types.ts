export interface ProgramArgs {
  nodePath: string;
  scriptPath: string;
  args: string[];
}


export interface IProgramCommand {
  test(args: ProgramArgs): boolean;
  run(...args: any[]): Promise<void>;
}
