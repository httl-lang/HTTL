import vscode from 'vscode';
import { HttlLanguageClient } from '../httl-language-client';
import { HttlExtensionContext } from '../../common';
import { HttlResponseViewProvider } from '../views/response';
import { HttlMainViewProvider } from '../views/main/httl-main-view';

export class HttlRunCommand {

  public static async execute(
    responseView: HttlResponseViewProvider,
    client: HttlLanguageClient,
    text: string,
    document: vscode.Uri | string,
  ) {

    const { fsPath, uri } = typeof document === 'string'
      ? {
        fsPath: document,
        uri: document,
      }
      : {
        fsPath: document.fsPath,
        uri: document.toString(),
      };

    await responseView.show();
    await responseView.setProgress(fsPath, true);

    const response = await client.sendRun(
      uri,
      text,
    );

    await responseView.setResponse(fsPath, response);
  };

  constructor(
    private readonly context: HttlExtensionContext,
    private readonly client: HttlLanguageClient,
    private readonly responseView: HttlResponseViewProvider
  ) {
    context.ext.subscriptions.push(
      vscode.commands.registerTextEditorCommand('httl.run', this.onExecute)
    );
  }

  private onExecute = async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: any[]) => {
    const { document, selection } = textEditor;
    const script = document.isUntitled ? document.getText() : '';

    await HttlRunCommand.execute(
      this.responseView,
      this.client,
      script,
      document.uri);
  };
}