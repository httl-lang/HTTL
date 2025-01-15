'use client';

import * as monaco from 'monaco-editor';
import { initServices } from 'monaco-languageclient/vscode/services';
import { LogLevel, initialize, createInstance } from 'vscode/services';
import getConfigurationServiceOverride from '@codingame/monaco-vscode-configuration-service-override';
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
import getEditorServiceOverride from '@codingame/monaco-vscode-editor-service-override';
import getViewsServiceOverride from '@codingame/monaco-vscode-views-service-override';
import getWorkbenchServiceOverride from '@codingame/monaco-vscode-workbench-service-override';

import '@codingame/monaco-vscode-json-default-extension';
import { MonacoLanguageClient } from 'monaco-languageclient';
import { WebSocketMessageReader, WebSocketMessageWriter, toSocket } from 'vscode-ws-jsonrpc';
import { CloseAction, ErrorAction, MessageTransports } from 'vscode-languageclient/browser.js';
import { ConsoleLogger } from 'monaco-languageclient/tools';
import { StandaloneServices } from 'vscode/services';
// import getMessageServiceOverride from 'vscode/service-override/messages';
import getFilesServiceOverride from '@codingame/monaco-vscode-files-service-override'


export const useOpenEditorStub = async (modelRef: any, options: any, sideBySide: any) => {
  console.log('Received open editor call with parameters: ', modelRef, options, sideBySide);
  return undefined;
};

export const runClient = async () => {
  await fetch('/api/socket');

  monaco.languages.register({ id: 'httl' });

  // StandaloneServices.initialize({});
  await initialize({}, undefined);

  // const logger = new ConsoleLogger(LogLevel.Debug);
  // const htmlContainer = document.getElementById('monaco-editor-root')!;
  // await initServices({
  //   // viewsConfig: {
  //   //   viewServiceType: 'ViewsService',
  //   // },
  //   workspaceConfig: {

  //   },
  //   serviceOverrides: {
  //     ...getConfigurationServiceOverride(),
  //     ...getKeybindingsServiceOverride(),
  //     ...getEditorServiceOverride(useOpenEditorStub),
  //     ...getViewsServiceOverride(),
  //     ...getWorkbenchServiceOverride(),
  //     ...getFilesServiceOverride(),
  //   },
  //   // vscodeApiInitPerformExternally: true,
  //   // userConfiguration: {
  //   //   json: JSON.stringify({
  //   //     'editor.experimental.asyncTokenization': true
  //   //   })
  //   // },
  // }, {
  //   htmlContainer: htmlContainer,
  //   logger
  // });

  initWebSocketAndStartClient('ws://localhost:3000/lsp');
};

/** parameterized version , support all languageId */
export const initWebSocketAndStartClient = (url: string): WebSocket => {
  const webSocket = new WebSocket(url);
  webSocket.onopen = async () => {
    const socket = toSocket(webSocket);
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);
    const languageClient = createLanguageClient({
      reader,
      writer
    });


    await languageClient.start();
    reader.onClose(() => {
      console.log('- reader closed -');
      languageClient.stop()
    });
  };
  return webSocket;
};

export const createLanguageClient = (messageTransports: MessageTransports): MonacoLanguageClient => {
  const languageClient = new MonacoLanguageClient({
    name: 'HTTL Language Client',
    clientOptions: {
      // use a language id as a document selector
      documentSelector: ['httl'],
      // documentSelector: [{ scheme: 'file', language: "httl" }],
      // disable the default error handler
      errorHandler: {
        error: () => ({ action: ErrorAction.Continue }),
        closed: () => ({ action: CloseAction.DoNotRestart })
      }
    },
    // create a language client connection from the JSON RPC connection on demand
    messageTransports,
  });

  languageClient.registerProposedFeatures();

  monaco.editor.registerCommand("custom/request:run", (...args) => {
    console.log('registerCommand', args)
    languageClient.sendRequest("custom/request:run", args[1])
      .then((result) => {
        console.log('Command executed successfully:', result);
      })
      .catch((error) => {
        console.error('Failed to execute command:', error);
      });
  })

  return languageClient;
};