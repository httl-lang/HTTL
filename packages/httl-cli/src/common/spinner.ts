import chalk from "chalk";
import ora, { Ora } from "ora";

const dotsCircle = {
  "interval": 80,
  "frames": [
    "⢎ ",
    "⠎⠁",
    "⠊⠑",
    "⠈⠱",
    " ⡱",
    "⢀⡰",
    "⢄⡠",
    "⢆⡀"
  ]
}

export class Spinner {

  public static start() {
    return ora({
      spinner: dotsCircle,
      text: chalk.dim(" Loading...")
    }).start();
  }

  constructor(
    private readonly spinner: Ora
  ) {
  }

  public stop(): void {
    this.spinner.stop();
  }
}