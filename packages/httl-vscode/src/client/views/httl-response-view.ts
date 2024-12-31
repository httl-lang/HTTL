
import vscode from 'vscode';
import { AppData, HttlExtensionContext, UIMessage } from '../../common';
import { Lang } from 'httl-core';

export class HttlResponseViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'httlResponseView';
  private view!: vscode.WebviewView;

  private delayedMessages: UIMessage[] = [];

  constructor(private readonly context: HttlExtensionContext) {
    // TODO: Preload webview
    // const preloadedWebview = vscode.window.createWebviewPanel(
    //   HttlResponseViewProvider.viewType,
    //   'My Preloaded Webview',
    //   { viewColumn: vscode.ViewColumn.Active, preserveFocus: false },
    //   {
    //     enableScripts: true,
    //     retainContextWhenHidden: true,
    //   }
    // );

    // preloadedWebview.webview.html = this.getHtmlForWebview(preloadedWebview.webview);
    // preloadedWebview.dispose();

    context.ext.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        HttlResponseViewProvider.viewType,
        this,
        { webviewOptions: { retainContextWhenHidden: true } }
      )
    );

    context.ext.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
          const document = editor.document;
          const filePath = document.uri.fsPath;

          this.changeActiveEditor(filePath);
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

  private editorsDecorationMap = new Map<string, vscode.TextEditorDecorationType>();

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken
  ) {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.ext.extensionUri, 'media'),
        vscode.Uri.joinPath(this.context.ext.extensionUri, 'dist')
      ]
    };

    webviewView.webview.onDidReceiveMessage(
      async message => {
        switch (message.command) {
          case 'ready': {
            await this.postMessage({ command: 'initialize' });
            return;
          }

          case 'create-example': {
            const document = await vscode.workspace.openTextDocument({
              content: message.payload,
              language: Lang.LANG_ID,
            });

            vscode.window.showTextDocument(document);
            return;
          }

          case 'code-scroll': {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
              vscode.window.showErrorMessage('No active editor found!');
              return;
            }

            const document = editor.document;
            const startPosition = document.positionAt(message.payload.start);
            const endPosition = document.positionAt(message.payload.end);

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
            const startPosition = document.positionAt(message.payload.start);
            const endPosition = document.positionAt(message.payload.end);

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
      },
      undefined,
      this.context.ext.subscriptions
    );

    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

    if (this.delayedMessages.length > 0) {
      setTimeout(async () => {
        for (const message of this.delayedMessages) {
          await this.postMessage(message);
        }
        this.delayedMessages = [];
      }, 0);
    }
  }

  public async changeActiveEditor(file: string) {
    await this.postMessage({ command: 'change-active-editor', file });
  }

  public async closeResponse(file: string) {
    await this.postMessage({ command: 'close-response', file });
  }

  public async show() {
    // First show
    if (this.view === undefined) {
      await vscode.commands.executeCommand(`${HttlResponseViewProvider.viewType}.focus`);
      return;
    }

    if (!this.view.visible) {
      this.view.show(true);
    }
  }

  public async setResponse(file: string, payload: any) {
    await this.postMessage({ command: 'set-response', file, payload });
  }

  public async setProgress(file: string, active?: boolean) {
    await this.postMessage({ command: 'set-progress', file, payload: active });
  }

  private async postMessage(message: UIMessage) {
    if (!this.view) {
      this.delayedMessages.push(message);
      return;
    }

    await this.view.webview.postMessage(message);
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
      this.context.ext.extensionUri, 'dist', 'ui.js'));

    const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(
      this.context.ext.extensionUri, 'media', 'reset.css'));

    const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(
      this.context.ext.extensionUri, 'media', 'vscode.css'));

    const styleAppUri = webview.asWebviewUri(vscode.Uri.joinPath(
      this.context.ext.extensionUri, 'media', 'app.css'));

    const baseUri = webview.asWebviewUri(vscode.Uri.joinPath(
      this.context.ext.extensionUri, 'dist'));

    const appData: AppData = {
      baseUri: baseUri.toString(),
      view: 'response',
    };

    return /* html */`
    	<!DOCTYPE html>
    	<html lang="en">
    	<head>
    		<meta charset="UTF-8">

    		<meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link href="${styleResetUri}" rel="stylesheet" />
    		<link href="${styleVSCodeUri}" rel="stylesheet" />
        <link href="${styleAppUri}" rel="stylesheet" />

    		<title>HTTL Webview</title>
    	</head>
    	<body>
        <div id="root"></div>
        <script>
          const vscode = typeof acquireVsCodeApi === "function"
              ? acquireVsCodeApi()
              : undefined;

          const appData = ${JSON.stringify(appData)}; 
          window.addEventListener('DOMContentLoaded', () => {
            vscode.postMessage({ command: 'ready' });
          });
        </script>
        <script src="${scriptUri}"></script>
    	</body>
    	</html>`;
  }
}