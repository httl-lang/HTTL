import chalk from "chalk";

export class JsonFormater {

  public static format(obj: any, depth = 0) {
    if (obj === null) {
      process.stdout.write(chalk.blueBright(`null`));
    } else if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        this.formatObject(obj, true, depth);
      } else {
        this.formatObject(Object.entries(obj), false, depth);
      }
    } else if (typeof obj === 'string') {
      process.stdout.write(chalk.yellow(`${JSON.stringify(obj)}`));
    } else if (typeof obj === 'number') {
      process.stdout.write(chalk.greenBright(`${obj}`));
    } else if (typeof obj === 'boolean') {
      process.stdout.write(chalk.magentaBright(`${obj}`));
    }
  }

  private static bracketColorPerLevel = [
    chalk.yellowBright,
    chalk.magenta,
    chalk.blue,
  ]

  private static formatObject(entries: any[], array: boolean, depth = 0) {
    const [open, close] = array ? ['[', ']'] : ['{', '}'];
    const bracketsColor = this.bracketColorPerLevel[depth % this.bracketColorPerLevel.length];

    process.stdout.write(bracketsColor(open));

    if (entries.length > 0) {
      process.stdout.write("\n");
      depth++;
    }

    entries.forEach((value, index) => {
      process.stdout.write('  '.repeat(depth));

      let actualValue = value;
      if (!array) {
        const [key, fieldValue] = value;
        actualValue = fieldValue;
        process.stdout.write(chalk.cyanBright(`"${key}"`));
        process.stdout.write(chalk.white(': '));
      }

      this.format(actualValue, depth);

      if (index < entries.length - 1) {
        process.stdout.write(",");
      }

      process.stdout.write("\n");
    });

    if (entries.length > 0) {
      depth--;
      process.stdout.write('  '.repeat(depth));
    }

    process.stdout.write(bracketsColor(close));
  }
}