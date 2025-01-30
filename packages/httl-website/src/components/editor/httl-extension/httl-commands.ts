import type vscode from "vscode"
import { HttlLanguageClient } from "./httl-language-client";

export class HttlCommands {
  private onExecutingCallbacks: ((state: boolean) => void)[] = [];
  private onExecutedCallbacks: ((result: any) => void)[] = [];

  constructor(
    private readonly vscodeApi: typeof vscode,
    private readonly client: HttlLanguageClient
  ) {

    vscodeApi.commands
      .registerTextEditorCommand(
        'httl.run',
        this.onExecuteCommand
      );
  }

  public runScript() {
    this.vscodeApi.commands.executeCommand('httl.run');
  }

  public onExecuting(ev: (state: boolean) => void) {
    this.onExecutingCallbacks.push(ev);
  }

  public onExecuted(ev: (result: any) => void) {
    this.onExecutedCallbacks.push(ev);
  }

  private onExecuteCommand = async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: any) => {
    this.onExecutingCallbacks.forEach(cb => cb(true));
    try {
      const { document, selection } = textEditor;
      const text = document.getText();

      const result = await this.client.sendRun(document.uri.toString(), text);
      this.onExecutedCallbacks.forEach(cb => cb(result));
    }
    catch (e) {
      console.error(e);
    }

    this.onExecutingCallbacks.forEach(cb => cb(false));
  }
}