
import vscode from 'vscode';
import { AppData, HttlExtensionContext, UIMessage } from '../../common';
import { Lang } from 'httl-core';

export abstract class HttlBaseViewProvider implements vscode.WebviewViewProvider {
  private isAppReady = false;
  protected view!: vscode.WebviewView;
  protected delayedMessages: UIMessage[] = [];


  constructor(
    protected readonly context: HttlExtensionContext,
    protected readonly viewType: string,
    protected readonly appData: Omit<AppData, 'baseUri'> | any,
    protected readonly services?: Record<string, any>,
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
        const { command, requestId, payload } = message;

        if (requestId) {
          const [service, action] = command.split('.');
          if (!service || !action) {
            throw new Error(`Invalid Service action ${command}`);
          }

          if (!this.services) {
            throw new Error('No services defined');
          }

          if (typeof this.services[service]?.[action] !== 'function') {
            throw new Error(`API method ${command} is not defined`);
          }

          const response = await this.services[service][action](payload);

          webviewView.webview.postMessage({
            command,
            requestId,
            payload: response
          });

          return;
        }

        switch (command) {
          case 'ready': {
            this.isAppReady = true;

            await this.postMessage({ command: 'initialize' });
            if (this.delayedMessages.length > 0) {
              for (const message of this.delayedMessages) {
                await this.postMessage(message);
              }
              this.delayedMessages = [];
            }
            return;
          }
          case 'save-state': {
            const { global, state: { key, value } } = message.payload;
            await this.context.saveState(`ui.${this.appData.view}.${key}`, value, global);
            return;
          }
        }

        await this.handleUIMessages(message);
      },
      undefined,
      this.context.ext.subscriptions
    );

    const globalState = this.context.getState(`ui.${this.appData.view}`, true);
    const workspaceState = this.context.getState(`ui.${this.appData.view}`);
    const appData = {
      ...this.appData,
      ...globalState,
      ...workspaceState,
    };

    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview, appData);
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

  public async setResponse(file: string, payload: any) {
    await this.postMessage({ command: 'set-response', file, payload });
  }

  protected async handleUIMessages(messagefromUI: any) { }

  protected async postMessage(message: UIMessage) {
    if (!this.isAppReady) {
      this.delayedMessages.push(message);
      return;
    }

    await this.view.webview.postMessage(message);
  }

  protected getHtmlForWebview(webview: vscode.Webview, appData: any): string {
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

    const finalAppData = {
      ...appData,
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

          const appData = ${JSON.stringify(finalAppData)}; 
        </script>
        <script src="${scriptUri}"></script>
      </body>
      </html>`;
  }
}