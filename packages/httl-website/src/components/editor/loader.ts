'use client';

import "@codingame/monaco-vscode-theme-defaults-default-extension";

import * as monaco from 'monaco-editor';

import { MonacoLanguageClient } from 'monaco-languageclient';
import { initServices } from 'monaco-languageclient/vscode/services';
import { ConsoleLogger } from 'monaco-languageclient/tools';

import { LogLevel } from 'vscode/services';
import { WebSocketMessageReader, WebSocketMessageWriter, toSocket } from 'vscode-ws-jsonrpc';
import { CloseAction, ErrorAction, MessageTransports } from 'vscode-languageclient/browser.js';

// Services Overrides
import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import getTextMateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import getConfigurationServiceOverride from "@codingame/monaco-vscode-configuration-service-override";
import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override";

import { activate } from "./httl-extension/extension";

const workerLoaders: Partial<Record<string, () => Worker>> = {
  TextEditorWorker: () => new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), { type: 'module' }),
  TextMateWorker: () => new Worker(new URL('@codingame/monaco-vscode-textmate-service-override/worker', import.meta.url), { type: 'module' }),
}

window.MonacoEnvironment = {
  getWorker: function (moduleId, label) {
    const workerFactory = workerLoaders[label]
    console.log('getWorker', moduleId, label, workerFactory);
    if (workerFactory != null) {
      return workerFactory()
    }
    throw new Error(`Unimplemented worker ${label} (${moduleId})`)
  }
}

export const useOpenEditorStub = async (modelRef: any, options: any, sideBySide: any) => {
  console.log('Received open editor call with parameters: ', modelRef, options, sideBySide);
  return undefined;
};

export const initializeMonaco = async () => {
  const logger = new ConsoleLogger(LogLevel.Debug);
  await Promise.all([
    // Initialize the VScode services
    initServices({
      loadThemes: true,
      serviceOverrides: {
        ...getConfigurationServiceOverride(),
        ...getTextMateServiceOverride(),
        ...getThemeServiceOverride(),
        ...getLanguagesServiceOverride(),
        ...getKeybindingsServiceOverride(),
        // ...getEditorServiceOverride(useOpenEditorStub),
        // ...getViewsServiceOverride(),
        // ...getWorkbenchServiceOverride(),
        // ...getFilesServiceOverride(),
      },
      userConfiguration: {
        json: JSON.stringify({
          'editor.experimental.asyncTokenization': true,
          "workbench.colorTheme": "Default Dark Modern",
        })
      },
    }, { logger }),

    // Initialize the HTTL extension
    activate(),

    // Initialize the WS socket
    fetch('/api/lsp'),
  ]);

  

  initWebSocketAndStartClient('ws://localhost:3000/lsp');
};

const initWebSocketAndStartClient = (url: string): WebSocket => {
  const webSocket = new WebSocket(url);

  webSocket.onopen = async () => {
    const socket = toSocket(webSocket);

    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);

    const languageClient = createLanguageClient({
      reader,
      writer
    });

    reader.onClose(() => {
      languageClient.stop()
    });

    await languageClient.start();
  };

  return webSocket;
};

const createLanguageClient = (messageTransports: MessageTransports): MonacoLanguageClient => {
  const languageClient = new MonacoLanguageClient({
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

  languageClient.registerProposedFeatures();

  return languageClient;
};