export class Param {
  constructor(
    public readonly value: string
  ) { }
}

export class Option {
  constructor(
    public readonly key: string,
    public readonly value: string
  ) { }
}

export type Argument = Param | Option;

export class ProgramArgs {
  public static parse(args: string[]): ProgramArgs {
    const programArgs = new ProgramArgs(
      args[0],
      args[1]
    );

    for (let i = 2; i < args.length; i++) {
      const argument = args[i];


      if (argument.startsWith("--")) {
        const nextArgument = args[i + 1];

        if (nextArgument?.startsWith("--")) {
          programArgs.args.push(
            new Option(argument.slice(2), undefined)
          );
        } else {
          programArgs.args.push(
            new Option(argument.slice(2), nextArgument)
          );
          i++;
        }
      } else {
        programArgs.args.push(
          new Param(argument)
        );
      }
    }

    return programArgs;
  }

  constructor(
    public readonly nodePath: string,
    public readonly scriptPath: string,
    public readonly args: Argument[] = []
  ) { }

  public clone(): ProgramArgs {
    return new ProgramArgs(
      this.nodePath,
      this.scriptPath,
      this.args.slice()
    );
  }

  public consume(): Argument | undefined {
    return this.args.shift();
  }

  public consumeEach(callback: (arg: Argument) => void) {
    while (this.args.length > 0) {
      const arg = this.consume();
      if (arg === undefined) {
        break;
      }

      callback(arg);
    }
  }
}