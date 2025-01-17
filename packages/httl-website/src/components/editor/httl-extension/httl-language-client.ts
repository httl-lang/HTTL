'use client';

import type vscode from "vscode"

import { MonacoLanguageClient } from 'monaco-languageclient';
import { WebSocketMessageReader, WebSocketMessageWriter, toSocket } from 'vscode-ws-jsonrpc';
import { CloseAction, ErrorAction, MessageTransports } from 'vscode-languageclient/browser.js';

export class HttlLanguageClient {
  private declare client: MonacoLanguageClient;

  constructor(
    private readonly lspUrl: string,
    private readonly lspActivationUrl: string,
    private readonly vscodeApi: typeof vscode
  ) { }

  public async start() {
    await fetch(this.lspActivationUrl);

    return new Promise<void>((resolve) => {
      const webSocket = new WebSocket(this.lspUrl);
      webSocket.onopen = async () => {
        const socket = toSocket(webSocket);

        const reader = new WebSocketMessageReader(socket);
        const writer = new WebSocketMessageWriter(socket);

        const languageClient = this.createLanguageClient({
          reader,
          writer
        });

        reader.onClose(() => {
          languageClient.stop()
        });

        await languageClient.start();

        resolve();
      };
    });
  }

  public async sendRun(documentUri: string, selection: string) {
    return await this.sendRequest("run", documentUri, { selection });
  }

  private async sendRequest(type: string, documentUri: string, data?: Object) {
    const response = await this.client.sendRequest(`custom/request:${type.toLowerCase()}`, { ...data, documentUri });
    return response;
  }

  private createLanguageClient(messageTransports: MessageTransports): MonacoLanguageClient {
    this.client = new MonacoLanguageClient({
      name: 'HTTL Language Client',
      clientOptions: {
        documentSelector: ['httl'],
        errorHandler: {
          error: () => ({ action: ErrorAction.Continue }),
          closed: () => ({ action: CloseAction.DoNotRestart })
        }
      },
      messageTransports,
    });

    this.client.registerProposedFeatures();

    return this.client;
  }
}