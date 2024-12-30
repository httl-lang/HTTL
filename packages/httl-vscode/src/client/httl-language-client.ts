import path from 'path';
import vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';
import { HttlExtensionContext } from '../common';
import { Lang } from 'httl-core';

export class HttlLanguageClient {

  public static current: HttlLanguageClient;

  /**
   * Activates language client
   */
  public static initialize(context: HttlExtensionContext) {
    HttlLanguageClient.current = new HttlLanguageClient(context);
    return HttlLanguageClient.current;
  }

  private readonly client: LanguageClient;

  constructor(
    private readonly context: HttlExtensionContext
  ) {

    const serverModule = context.ext.asAbsolutePath(
      path.join('dist', 'server.js')
    );

    const serverOptions: ServerOptions = {
      run: { module: serverModule, transport: TransportKind.ipc },
      debug: {
        module: serverModule,
        transport: TransportKind.ipc,
        options: { execArgv: ['--nolazy', '--inspect=6009'] }
      },
    };

    const clientOptions: LanguageClientOptions = {
      documentSelector: [
        { scheme: 'file', language: Lang.LANG_ID },
        { scheme: 'untitled', language: Lang.LANG_ID }
      ],
      synchronize: {
        fileEvents: vscode.workspace.createFileSystemWatcher(`**/*.${Lang.FILE_EXTENSION}`)
      },
    };

    // Create the language client.
    this.client = new LanguageClient(
      'httlLanguageServer',
      'Httl Language Server',
      serverOptions,
      clientOptions
    );

    this.context.ext.subscriptions.push(this.client);
  }

  /**
   * Start the client. This will also launch the server
   */
  public async start() {
    await this.client.start();
  }

  /**
   * Deactivates the client and stops the server
   */
  public async dispose() {
    await this.client?.stop();
    this.context.dispose();
  }

  /**
   * Sends a Run request to the server
   */
  public async sendRun(documentUri: string, selection: string) {
    return await this.sendRequest("run", documentUri, { selection });
  }

  /**
   * Sends a inline_completion request to the server
   */

  public async sendInlineCompletion(documentUri: string, position: vscode.Position): Promise<vscode.InlineCompletionItem[]> {
    return await this.sendRequest("inline_completion", documentUri, { position }) as any as vscode.InlineCompletionItem[];

  }

  private async sendRequest(type: string, documentUri: string, data?: Object) {
    const response = await this.client.sendRequest(`custom/request:${type.toLowerCase()}`, { ...data, documentUri });
    return response;
  }
}