import vscode from 'vscode';
import { HttlLanguageClient } from '../httl-language-client';
import { HttlExtensionContext } from '../../common';
import { HttlResponseViewProvider } from '../views/httl-response-view';
import { HttlMainViewProvider } from '../views/httl-main-view';

export class HttlRunCommand {

  public static async execute(responseView: HttlResponseViewProvider, mainView: HttlMainViewProvider | null, client: HttlLanguageClient, text: string, documentUri: string, filePath: string) {
    await responseView.show();
    await responseView.setProgress(filePath, true);

    const response = await client.sendRun(
      documentUri,
      text,
    );
    await responseView.setResponse(filePath, response);
    await mainView?.setResponse(filePath, response); // TODO: temporary
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
    const text = document.isUntitled ? document.getText() : '';

    await HttlRunCommand.execute(
      this.responseView,
      null, // TODO: temporary
      this.client,
      text,
      document.uri.toString(),
      document.uri.fsPath);
  };
}