'use client';

// import '@codingame/monaco-vscode-python-default-extension';
import "@codingame/monaco-vscode-theme-defaults-default-extension";

import * as monaco from 'monaco-editor';

import { MonacoLanguageClient } from 'monaco-languageclient';
import { initServices } from 'monaco-languageclient/vscode/services';
import { ConsoleLogger } from 'monaco-languageclient/tools';

import { LogLevel } from 'vscode/services';
import { WebSocketMessageReader, WebSocketMessageWriter, toSocket } from 'vscode-ws-jsonrpc';
import { CloseAction, ErrorAction, MessageTransports } from 'vscode-languageclient/browser.js';
import * as vscode from 'vscode'
// monaco workers 
// @ts-ignore
// import textMateWorker from '@codingame/monaco-vscode-textmate-service-override/worker';
// @ts-ignore
// import editorWorker from '@root/monaco-editor/esm/vs/editor/editor.worker.js';
// import textMateWorker from '@codingame/monaco-vscode-textmate-service-override/workers/textmate.worker.js';

// Services Overrides
import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import getTextMateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import getConfigurationServiceOverride from "@codingame/monaco-vscode-configuration-service-override";
import { initialize } from "./httl-extension";

const workerLoaders: Partial<Record<string, () => Worker>> = {
  TextEditorWorker: () => new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), { type: 'module' }),
  // TextEditorWorker: () => new editorWorker(),
  TextMateWorker: () => new Worker(new URL('@codingame/monaco-vscode-textmate-service-override/worker', import.meta.url), { type: 'module' }),
  // TextMateWorker: () => new textMateWorker(),
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

export const initializeMonacoServices = async () => {
  await fetch('/api/socket');
  await initServices({
    loadThemes: true,
    serviceOverrides: {
      ...getConfigurationServiceOverride(),
      ...getTextMateServiceOverride(),
      ...getThemeServiceOverride(),
      ...getLanguagesServiceOverride(),
      // ...getKeybindingsServiceOverride(),
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
  }, {
    logger: new ConsoleLogger(LogLevel.Debug),
  });

  await initialize();

  // monaco.languages.register({ id: "httl", extensions: ['.httl'] });

  // vscode.languages.setLanguageConfiguration("httl", {
  //   comments: { "lineComment": "#" },
  //   brackets: [["{", "}"], ["[", "]"], ["<", ">"]],
  //   autoClosingPairs: [
  //     { "open": "{", "close": "}" },
  //     { "open": "[", "close": "]" },
  //     { "open": "(", "close": ")" },
  //     { "open": "'", "close": "'" },
  //     { "open": "\"", "close": "\"" },
  //     { "open": "`", "close": "`" },
  //   ]
  // });

  // monaco.languages.setMonarchTokensProvider('httl', {
  //   keywords: [
  //     'assert', 'as', 'use',
  //     'formdata', 'urlencoded', 'bin', 'raw',
  //     'true', 'false', 'null'
  //   ],
  //   tokenizer: {
  //     root: [
  //       // Comments
  //       [/#.*$/, 'comment'],

  //       // Request methods
  //       [/^\s*(get|post|put|delete|patch|head|options|connect|trace|lock|unlock|propfind|proppatch|copy|move|mkcol|mkcalendar|acl|search)\s+/, 'keyword'],

  //       // Extended HTTP syntax
  //       [/^(@)([^\s:]+\s*:)(.*)$/, ['keyword', 'variable', 'string']],
  //       [/^([^\s:]+\s*:)(.*)$/, ['variable', 'string']],

  //       // Keywords
  //       [/\b(assert|as|use)\b/, 'keyword.control'],
  //       [/\b(formdata|urlencoded|bin|raw)\b/, 'entity.name.function'],

  //       // Numbers
  //       [/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/, 'number'],

  //       // Strings
  //       [/"([^"\\]|\\.)*$/, 'string.invalid'],  // Non-terminated string
  //       [/"/, 'string', '@string'],

  //       // Arrays
  //       [/\[/, 'delimiter.array', '@array'],

  //       // Objects
  //       [/\{/, 'delimiter.object', '@object'],

  //       // Constants
  //       [/\b(?:true|false|null)\b/, 'constant'],
  //     ],

  //     string: [
  //       [/[^\\"]+/, 'string'],
  //       [/\\./, 'string.escape.invalid'],
  //       [/"/, 'string', '@pop']
  //     ],

  //     array: [
  //       [/\]/, 'delimiter.array', '@pop'],
  //       [/,/, 'delimiter.array'],
  //       { include: 'root' }
  //     ],

  //     object: [
  //       [/\}/, 'delimiter.object', '@pop'],
  //       [/:/, 'delimiter'],
  //       [/,/, 'delimiter'],
  //       { include: 'root' }
  //     ]
  //   }
  // });

  initWebSocketAndStartClient('ws://localhost:3000/lsp');
};

/** parameterized version , support all languageId */
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


    await languageClient.start();
    reader.onClose(() => {
      console.log('- reader closed -');
      languageClient.stop()
    });
  };
  return webSocket;
};

const createLanguageClient = (messageTransports: MessageTransports): MonacoLanguageClient => {
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