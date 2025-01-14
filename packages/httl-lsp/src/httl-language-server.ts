import {
  createConnection,
  ProposedFeatures,
  InitializeParams,
  DidChangeConfigurationNotification,
  TextDocumentSyncKind,
  InitializeResult,
  _Connection,
} from 'vscode-languageserver/node';

import Httl from 'httl-core';
import { HttlCompletionProvider } from './providers/httl-completion-provider';
import { HttlDocumentsProvider } from './providers/httl-documents-provider';
import { HttlDiagnosticsProvider } from './providers/httl-diagnostics-provider';
import { HttlCommandsExecutor } from './providers/httl-commands-executor';
import { HttlFormattingProvider } from './providers/httl-formatting-provider';


export default class HttlLanguageServer {
  public readonly connection: _Connection;

  public declare httl: Httl;
  public declare documents: HttlDocumentsProvider;
  public declare diagnostics: HttlDiagnosticsProvider;
  public declare completion: HttlCompletionProvider;
  public declare commands: HttlCommandsExecutor;
  public declare formatting: HttlFormattingProvider;


  private hasConfigurationCapability = false;
  private hasWorkspaceFolderCapability = false;
  private hasDiagnosticRelatedInformationCapability = false;
  private workdir!: string;

  constructor() {
    this.connection = createConnection(ProposedFeatures.all);

    this.connection.onInitialize(this.handleInitialize);
    this.connection.onInitialized(() => {
      if (this.hasConfigurationCapability) {
        this.connection.client.register(DidChangeConfigurationNotification.type, undefined);
      }

      // Initialize HTTL core
      this.httl = new Httl({
        workdir: this.workdir,
      });

      this.documents = new HttlDocumentsProvider(this.connection, this.httl);
      this.diagnostics = new HttlDiagnosticsProvider(this.connection, this.documents);
      this.completion = new HttlCompletionProvider(this.connection, this.documents);
      this.commands = new HttlCommandsExecutor(this.connection, this.documents);
      this.formatting = new HttlFormattingProvider(this.connection, this.documents);
    });

    process.on('SIGINT', () => {
      this.stop();
      process.exit(0); // Exit the process
    });
  }

  public start() {
    this.connection.listen();
  }

  public stop() {
    this.connection.dispose();
    // this.documents.dispose();
  }

  private handleInitialize = (params: InitializeParams) => {
    const capabilities = params.capabilities;
    this.workdir = params.workspaceFolders?.[0].uri as string;

    this.hasConfigurationCapability = !!(
      capabilities.workspace && !!capabilities.workspace.configuration
    );
    this.hasWorkspaceFolderCapability = !!(
      capabilities.workspace && !!capabilities.workspace.workspaceFolders
    );
    this.hasDiagnosticRelatedInformationCapability = !!(
      capabilities.textDocument &&
      capabilities.textDocument.publishDiagnostics &&
      capabilities.textDocument.publishDiagnostics.relatedInformation
    );

    const result: InitializeResult = {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        documentFormattingProvider: true,
        completionProvider: {
          resolveProvider: true,
          triggerCharacters: ['.', ':', '@', '/'],
          workDoneProgress: true,
          completionItem: {
            labelDetailsSupport: true,
          }
        },
        diagnosticProvider: {
          identifier: 'httl',
          workDoneProgress: true,
          interFileDependencies: false,
          workspaceDiagnostics: false,
        }
      }
    };
    if (this.hasWorkspaceFolderCapability) {
      result.capabilities.workspace = {
        workspaceFolders: {
          supported: true
        }
      };
    }
    return result;
  };
}