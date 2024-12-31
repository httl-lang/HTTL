
import vscode from 'vscode';
import { AppData, HttlExtensionContext, UIMessage } from '../../common';
import { Lang } from 'httl-core';

export abstract class HttlBaseViewProvider implements vscode.WebviewViewProvider {
  protected view!: vscode.WebviewView;
  protected delayedMessages: UIMessage[] = [];

  constructor(
    protected readonly context: HttlExtensionContext,
    protected readonly viewType: string,
    protected readonly appData: Omit<AppData, 'baseUri'> | any
  ) {
    context.ext.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        viewType,
        this,
        { webviewOptions: { retainContextWhenHidden: true } }
      )
    );
  }

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

  public async show() {
    // First show
    if (this.view === undefined) {
      await vscode.commands.executeCommand(`${this.viewType}.focus`);
      return;
    }

    if (!this.view.visible) {
      this.view.show(true);
    }
  }

  protected async postMessage(message: UIMessage) {
    if (!this.view) {
      this.delayedMessages.push(message);
      return;
    }

    await this.view.webview.postMessage(message);
  }

  protected getHtmlForWebview(webview: vscode.Webview): string {
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

    const appData = {
      ...this.appData,
      baseUri: baseUri.toString(),
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