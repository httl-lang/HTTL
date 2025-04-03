import { Api } from "../../../services/api";

export class QuickRunApi extends Api {
  public runScript(script: string): Promise<string> {
    return this.sendRequest('quickRun.runScript', { script });
  }
}