import chalk from "chalk";
import { CommandProps, IProgramCommand } from "../../types";
import { Option, Param, ProgramArgs } from "../../common/program-args";
import { Input } from "../../common/input";
import packageJson from "../../../package.json";

export class HelpCommand implements IProgramCommand {

  public async parse(programArgs: ProgramArgs): Promise<CommandProps> {
    if (programArgs.args.length === 0 && !Input.hasRedirection()) {
      return true;
    }

    const arg = programArgs.consume();
    const command = arg instanceof Param
      ? arg?.value
      : arg instanceof Option
        ? arg.key
        : undefined;

    if (command?.toLowerCase() === "help") {
      return true;
    }
  }

  public async run(): Promise<void> {
    console.log(chalk.white(`Welcome to HTTL v${packageJson.version}`));
    process.stdout.write(`HTTP client for the terminal, powered by HTTL engine, learn more at `);
    console.log(chalk.blue(`https://httl.dev`));
    console.log();
    console.log(chalk.white.bold(`Usage:`));
    console.log();

    process.stdout.write(chalk.white(`· `));
    process.stdout.write(`httl `);
    process.stdout.write(chalk.green.bold(`method `));
    process.stdout.write(chalk.yellowBright.bold(`url `));
    process.stdout.write(chalk.blueBright.bold(`[headers] `));
    process.stdout.write(chalk.cyanBright.bold(`[body_format] `));
    console.log(chalk.magentaBright.bold(`[body]`));
    console.log();
    console.log(chalk.white(`   Make a HTTP request`));
    process.stdout.write(chalk.green.bold(`    method`));
    process.stdout.write(chalk.white(` - one of the HTTP methods: `));
    console.log(chalk.gray(`'get', 'post', 'put', 'delete', 'patch', 'head', 'options',
    'connect', 'trace', 'lock', 'unlock', 'propfind', 'proppatch',
    'copy', 'move', 'mkcol', 'mkcalendar', 'acl', 'search'`));
    console.log();
    process.stdout.write(chalk.yellowBright.bold(`    url`));
    console.log(chalk.white(` - the URL to make the request, can be absolute or relative if you use along with a default .httl file`));
    console.log();

    process.stdout.write(chalk.blueBright.bold(`    headers`));
    console.log(chalk.white(` - headers in the format 'key:value' separated by space, example: Authorization:token`));
    console.log();

    process.stdout.write(chalk.cyanBright.bold(`    body_format`));
    console.log(chalk.white(` - body format, one of '--json' (default), '--formdata', '--urlencoded', '--raw', '--bin'`));
    console.log();

    process.stdout.write(chalk.magentaBright.bold(`    body`));
    console.log(chalk.white(` - body content, example: '{ name: "John" }'`));
    console.log();
    console.log(chalk.white(`   Examples:`));
    console.log();
    console.log(chalk.gray(`    Simple GET request`));
    console.log(chalk.white(`     httl get https://httl.dev/api/users`));
    console.log();
    console.log(chalk.gray('    Simple GET request with a basic .httl file with content: `@base: https://httl.dev/api`'));
    process.stdout.write(chalk.gray(`    (more about the default .httl file at `));
    process.stdout.write(chalk.blue(`https://httl.dev/docs/guide/module#default-httl-file`));
    console.log(chalk.gray(`)`));
    console.log(chalk.white(`     httl get users`));
    console.log();
    console.log(chalk.gray(`    GET request with headers`));
    console.log(chalk.white(`     httl get https://httl.dev/api/users Authorization:"Bearer token" Cache-Control:private`));
    console.log();
    console.log(chalk.gray(`    POST request with a JSON body`));
    console.log(chalk.white(`     httl post https://httpbin.org/anything '{ name: "John" }'`));
    console.log();
    console.log(chalk.gray(`    PUT request with form data; JSON payload will be converted to form data`));
    console.log(chalk.white(`     httl put https://httpbin.org/anything --formdata '{ name: "John" }'`));
    console.log();
    console.log(chalk.gray(`    POST request with a URL-encoded body`));
    console.log(chalk.white(`     httl post https://httpbin.org/anything --urlencoded '{ name: "John" }'`));
    console.log();
    console.log(chalk.gray(`    POST request with a raw body`));
    console.log(chalk.white(`     httl post https://httpbin.org/anything 'name=John&age=30'`));
    console.log();
    console.log(chalk.gray(`    POST request with a binary file`));
    console.log(chalk.white(`     httl post https://httpbin.org/anything --bin ./file.bin`));
    console.log();
    console.log(chalk.gray(`    POST request with a payload from the input stream; HTTP will automatically detect the content type.`));
    console.log(chalk.white(`     httl post https://httpbin.org/anything < ./payload.json`));
    console.log();
    console.log();

    process.stdout.write(chalk.white(`· `));
    process.stdout.write(`httl `);
    console.log(chalk.yellowBright.bold(`file_path`));
    console.log();
    console.log(chalk.white(`   Run a HTTL file`));
    console.log();
    console.log(chalk.white(`   Examples:`));
    console.log();
    console.log(chalk.gray(`    Run a HTTL file`));
    console.log(chalk.white(`     httl ./file.httl`));
    console.log();
    console.log(chalk.gray(`    Run a HTTL file from input file stream`));
    console.log(chalk.white(`     httl < ./file.httl`));
    console.log();
    console.log(chalk.gray(`    Run a HTTL file from input stream`));
    console.log(chalk.white(`     httl <<EOF`));
    console.log(chalk.white(`     @base: https://httl.dev/api`));
    console.log(chalk.white(`     @auth-basic: admin admin`));
    console.log(chalk.white(`     post /auth`));
    console.log(chalk.white(`     EOF`));
    console.log();
    console.log();

    process.stdout.write('More information at ');
    console.log(chalk.blue(`https://httl.dev/docs`));
  }
}