import chalk from "chalk";

export class JsonFormater {

  public static format2(entries: any[], array: boolean, depth = 0) {
    const [open, close] = array ? ['[', ']'] : ['{', '}'];
    process.stdout.write(chalk.yellow(open));

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
        process.stdout.write(chalk.cyanBright(`"${key}": `));
      }

      this.format(actualValue, depth);

      if (index < entries.length - 1) {
        process.stdout.write(",");
      }

      process.stdout.write(chalk.yellow("\n"));
    });

    if (entries.length > 0) {
      depth--;
      process.stdout.write('  '.repeat(depth));
    }

    process.stdout.write(chalk.yellow(close));
  }

  public static format(obj: any, depth = 0) {
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj)) {
        this.format2(obj, true, depth);

        // process.stdout.write(chalk.yellow(`[`));
        // if (obj.length > 0) {
        //   process.stdout.write("\n");
        //   depth++;
        // }

        // obj.forEach((item, index) => {
        //   process.stdout.write('  '.repeat(depth));
        //   this.format(item, depth);

        //   if (index < obj.length - 1) {
        //     process.stdout.write(",");
        //   }

        //   process.stdout.write(chalk.yellow("\n"));
        // });

        // if (obj.length > 0) {
        //   depth--;
        //   process.stdout.write('  '.repeat(depth));
        // }

        // process.stdout.write(chalk.yellow("]"));
      } else {
        this.format2(Object.entries(obj), false, depth);
        // process.stdout.write(chalk.yellow(`{`));
        // const entries = Object.entries(obj)

        // if (entries.length > 0) {
        //   process.stdout.write("\n");
        //   depth++;
        // }

        // entries.forEach(([key, value], index) => {
        //   process.stdout.write('  '.repeat(depth));
        //   process.stdout.write(chalk.cyanBright(`"${key}": `));
        //   this.format(value, depth);
        //   if (index < entries.length - 1) {
        //     process.stdout.write(",");
        //   }

        //   process.stdout.write(chalk.yellow("\n"));
        // });

        // if (entries.length > 0) {
        //   depth--;
        //   process.stdout.write('  '.repeat(depth));
        // }

        // process.stdout.write(chalk.yellow("}"));
      }
    } else {
      process.stdout.write(chalk.whiteBright(`${JSON.stringify(obj)}`));
    }
  }
}