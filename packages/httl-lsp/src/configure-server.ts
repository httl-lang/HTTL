import {
  _Connection,
  InitializeParams,
  InitializeResult,
  DidChangeConfigurationNotification,
  TextDocumentSyncKind,
} from 'vscode-languageserver';

import Httl, { IHttpClient } from 'httl-core';
import { HttlCompletionProvider } from './providers/httl-completion-provider';
import { HttlDocumentsProvider } from './providers/httl-documents-provider';
import { HttlDiagnosticsProvider } from './providers/httl-diagnostics-provider';
import { HttlCommandsExecutor } from './providers/httl-commands-executor';
import { HttlFormattingProvider } from './providers/httl-formatting-provider';

export interface ConfigureServerOptions {
  httpClient?: IHttpClient;
}

export function configureServer(connection: _Connection, options: ConfigureServerOptions = {}) {
  let hasConfigurationCapability = false;
  let hasWorkspaceFolderCapability = false;
  let workdir = '/';

  connection.onInitialize((params: InitializeParams) => {
    const capabilities = params.capabilities;
    workdir = params.workspaceFolders?.[0]?.uri ?? '/';

    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);

    const result: InitializeResult = {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        documentFormattingProvider: true,
        completionProvider: {
          resolveProvider: true,
          triggerCharacters: ['.', ':', '@', '/'],
          workDoneProgress: true,
          completionItem: { labelDetailsSupport: true },
        },
        diagnosticProvider: {
          identifier: 'httl',
          workDoneProgress: true,
          interFileDependencies: false,
          workspaceDiagnostics: false,
        },
      },
    };

    if (hasWorkspaceFolderCapability) {
      result.capabilities.workspace = { workspaceFolders: { supported: true } };
    }

    return result;
  });

  connection.onInitialized(() => {
    if (hasConfigurationCapability) {
      connection.client.register(DidChangeConfigurationNotification.type, undefined);
    }

    const httl = new Httl({ workdir, httpClient: options.httpClient });

    const documents = new HttlDocumentsProvider(connection, httl);
    new HttlDiagnosticsProvider(connection, documents);
    new HttlCompletionProvider(connection, documents);
    new HttlCommandsExecutor(connection, documents);
    new HttlFormattingProvider(connection, documents);
  });

  return connection;
}
