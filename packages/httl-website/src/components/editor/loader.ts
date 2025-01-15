'use client';

import * as monaco from 'monaco-editor';

// monaco workers 
// @ts-ignore 
import editorWorker from '@root/monaco-editor/esm/vs/editor/editor.worker.js';
import { initialize as initializeMonacoService } from 'vscode/services'


import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import getTextMateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import getConfigurationServiceOverride from "@codingame/monaco-vscode-configuration-service-override";

import { initServices } from 'monaco-languageclient/vscode/services';
import { LogLevel, initialize, createInstance } from 'vscode/services';


// import '@codingame/monaco-vscode-json-default-extension';
import { MonacoLanguageClient } from 'monaco-languageclient';
import { WebSocketMessageReader, WebSocketMessageWriter, toSocket } from 'vscode-ws-jsonrpc';
import { CloseAction, ErrorAction, MessageTransports } from 'vscode-languageclient/browser.js';
import { ConsoleLogger } from 'monaco-languageclient/tools';
// import { StandaloneServices } from 'vscode/services';
// // import getMessageServiceOverride from 'vscode/service-override/messages';
// import getFilesServiceOverride from '@codingame/monaco-vscode-files-service-override'



const workerLoaders: Partial<Record<string, () => Worker>> = {
  // TextEditorWorker: () => new Worker(new URL('/_next/static/editor.worker.js', import.meta.url), { type: 'module' })
  TextEditorWorker: () => new editorWorker()
  // TextEditorWorker: () => new Worker('@root/monaco-editor/esm/vs/editor/editor.worker.js?worker', { type: 'module' })
  // TextEditorWorker: () => new Worker('/_next/static/editor.worker.js', { type: 'module' })

}

window.MonacoEnvironment = {
  getWorker: function (moduleId, label) {
    const workerFactory = workerLoaders[label]
    console.log('getWorker', moduleId, label, workerFactory)
    if (workerFactory != null) {
      return workerFactory()
    }
    throw new Error(`Unimplemented worker ${label} (${moduleId})`)
  }
}

// self.MonacoEnvironment = {
//   getWorkerUrl: function (moduleId, label) {
//     if (label === 'json') {
//       return '/_next/static/json.worker.js';
//     }
//     if (label === 'css') {
//       return '/_next/static/css.worker.js';
//     }
//     if (label === 'html') {
//       return '/_next/static/html.worker.js';
//     }
//     if (label === 'typescript' || label === 'javascript') {
//       return '/_next/static/ts.worker.js';
//     }
//     return '/_next/static/editor.worker.js';
//   },
// };

export const useOpenEditorStub = async (modelRef: any, options: any, sideBySide: any) => {
  console.log('Received open editor call with parameters: ', modelRef, options, sideBySide);
  return undefined;
};

export const runClient = async () => {
  await fetch('/api/socket');

  // StandaloneServices.initialize({});

  // await initializeMonacoService({
  //   ...getTextMateServiceOverride(),
  //   ...getThemeServiceOverride(),
  //   ...getLanguagesServiceOverride(),
  // })

  const logger = new ConsoleLogger(LogLevel.Debug);
  const htmlContainer = document.getElementById('monaco-editor-root')!;
  await initServices({
    // viewsConfig: {
    //   viewServiceType: 'ViewsService',
    // },
    workspaceConfig: {

    },
    serviceOverrides: {
      ...getConfigurationServiceOverride(),
      // ...getTextMateServiceOverride(),
      // ...getThemeServiceOverride(),
      // ...getLanguagesServiceOverride(),

      // ...getKeybindingsServiceOverride(),
      // ...getEditorServiceOverride(useOpenEditorStub),
      // ...getViewsServiceOverride(),
      // ...getWorkbenchServiceOverride(),
      // ...getFilesServiceOverride(),
    },
    // vscodeApiInitPerformExternally: true,
    // userConfiguration: {
    //   json: JSON.stringify({
    //     'editor.experimental.asyncTokenization': true
    //   })
    // },
  }, {
    htmlContainer: htmlContainer,
    logger
  });

  monaco.languages.register({ id: 'httl' });

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