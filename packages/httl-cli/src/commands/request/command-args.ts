import { Option } from "../../common/program-args";

export class RequestCommandArgs {
  public static bodyFormats = [
    'json', 'formdata', 'urlencoded', 'raw', "bin"
  ];

  public static methods = [
    'get', 'post', 'put', 'delete', 'patch', 'head', 'options',
    'connect', 'trace', 'lock', 'unlock', 'propfind', 'proppatch',
    'copy', 'move', 'mkcol', 'mkcalendar', 'acl', 'search'
  ];

  public headers: { key: string; value: string; }[] = [];
  public options: Option[] = [];
  public body: string;
  public format: string;

  constructor(
    public readonly method: string,
    public readonly url: string,
    public readonly hasRedirection: boolean
  ) { }

  public addHeader(key: string, value: string) {
    this.headers.push({ key, value });
  }

  public setBody(value: any) {
    if (value === undefined) {
      return;
    }

    if (this.body !== undefined) {
      console.error('Cannot set body multiple times');
      process.exit(1);
    }

    this.body = value;

    if (this.format === undefined) {
      const temp = value.trim();
      this.format =
        temp.startsWith('{') && temp.endsWith('}') || temp.startsWith('[') && temp.endsWith(']')
          ? 'json'
          : 'raw';
    }

    if (this.format === 'raw') {
      this.body = `"${value.replace(/"/g, '\\"')}"`;
    }

    if (this.format === 'bin') {
      this.body = `"${value}"`;
    }
  }

  public setOption(key: string, value: string) {
    if (RequestCommandArgs.bodyFormats.includes(key)) {
      this.format = key;
      this.setBody(value);
      return;
    }

    console.error(`Invalid option: --${key}`);
    process.exit(1);
  }
}
