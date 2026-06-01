'use client';

import type vscode from "vscode";

import { MonacoLanguageClient } from 'monaco-languageclient';
import { BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver-protocol/browser.js';
import { CloseAction, ErrorAction, MessageTransports } from 'vscode-languageclient/browser.js';

export class HttlLanguageClient {
  private declare client: MonacoLanguageClient;

  constructor(
    private readonly worker: Worker,
    private readonly vscodeApi: typeof vscode,
  ) { }

  public async start() {
    const reader = new BrowserMessageReader(this.worker);
    const writer = new BrowserMessageWriter(this.worker);

    this.client = this.createLanguageClient({ reader, writer });
    await this.client.start();
  }

  public async sendRun(documentUri: string, selection: string) {
    return await this.sendRequest("run", documentUri, { selection });
  }

  private async sendRequest(type: string, documentUri: string, data?: Object) {
    return await this.client.sendRequest(`custom/request:${type.toLowerCase()}`, { ...data, documentUri });
  }

  private createLanguageClient(messageTransports: MessageTransports): MonacoLanguageClient {
    const client = new MonacoLanguageClient({
      name: 'HTTL Language Client',
      clientOptions: {
        documentSelector: ['httl'],
        errorHandler: {
          error: () => ({ action: ErrorAction.Continue }),
          closed: () => ({ action: CloseAction.DoNotRestart }),
        },
      },
      messageTransports,
    });

    client.registerProposedFeatures();
    return client;
  }
}
