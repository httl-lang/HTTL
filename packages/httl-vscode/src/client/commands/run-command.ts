import vscode from 'vscode';
import { HttlLanguageClient } from '../httl-language-client';
import { HttlExtensionContext } from '../../common';
import { HttlResponseViewProvider } from '../views/httl-response-view';

export class HttlRunCommand {

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

    await this.responseView.show();
    await this.responseView.setProgress(document.uri.fsPath, true);

    const response = await this.client.sendRun(
      document.uri.toString(),
      text,
    );
    await this.responseView.setResponse(document.uri.fsPath, response);
  };
}