
import vscode from 'vscode';
import { AppData, HttlExtensionContext, UIMessage } from '../../../common';
import { Lang } from 'httl-core';
import { HttlBaseViewProvider } from '../base-view';

export class HttlResponseViewProvider extends HttlBaseViewProvider {
  public static readonly viewType = 'httlResponseView';
  private editorsDecorationMap = new Map<string, vscode.TextEditorDecorationType>();

  constructor(context: HttlExtensionContext) {
    super(context, HttlResponseViewProvider.viewType, {
      view: 'response',
    });

    context.ext.subscriptions.push(
      vscode.window.onDidChangeTextEditorSelection((editorSelection) => {
        const { document } = editorSelection.textEditor;
        if (document.languageId === Lang.LANG_ID) {
          this.changeActiveEditor(editorSelection.textEditor.document.uri.fsPath);
        }
      })
    );

    context.ext.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
          this.changeActiveEditor(editor.document.uri.fsPath);
        }
      })
    );

    context.ext.subscriptions.push(
      vscode.workspace.onDidCloseTextDocument((document) => {
        if (document.isUntitled) {
          this.closeResponse(document.uri.fsPath);
        }
      })
    );
  }

  protected override async handleUIMessages(messagefromUI: any): Promise<void> {
    switch (messagefromUI.command) {
      case 'code-scroll': {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage('No active editor found!');
          return;
        }

        const document = editor.document;
        const startPosition = document.positionAt(messagefromUI.payload.start);
        const endPosition = document.positionAt(messagefromUI.payload.end);

        // Scroll to the range
        editor.revealRange(new vscode.Range(startPosition, endPosition), vscode.TextEditorRevealType.InCenter);

        return;
      }

      case 'code-highlight': {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage('No active editor found!');
          return;
        }

        this.editorsDecorationMap.get(editor.document.uri.fsPath)?.dispose();

        const document = editor.document;
        const startPosition = document.positionAt(messagefromUI.payload.start);
        const endPosition = document.positionAt(messagefromUI.payload.end);

        const range = new vscode.Range(startPosition, endPosition);

        const decorationType = vscode.window.createTextEditorDecorationType({
          backgroundColor: 'rgba(225, 255, 0, 0.14)',
          border: '0.1px solid rgba(255, 255, 0, 0.2)',
          borderRadius: '4px',
        });

        editor.setDecorations(decorationType, [range]);
        this.editorsDecorationMap.set(editor.document.uri.fsPath, decorationType);

        setTimeout(() => {
          decorationType.dispose();
        }, 4000);

        return;
      }
    }
  }

  public async changeActiveEditor(file: string | undefined) {
    await this.postMessage({ command: 'change-active-editor', file });
  }

  public async closeResponse(file: string) {
    await this.postMessage({ command: 'close-response', file });
  }

  public async setProgress(file: string, active?: boolean) {
    await this.postMessage({ command: 'set-progress', file, payload: active });
  }
}