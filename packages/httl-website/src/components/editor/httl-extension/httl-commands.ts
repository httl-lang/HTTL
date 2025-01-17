import type vscode from "vscode"
import { HttlLanguageClient } from "./httl-language-client";

export class HttlCommands {
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

  private onExecuteCommand = async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: any) => {
    const { document, selection } = textEditor;
    const text = document.getText();

    const result = await this.client.sendRun(document.uri.toString(), text);
    console.log(result);
  }
}