import {
  TextDocuments,
  _Connection,
  TextDocumentChangeEvent,
} from 'vscode-languageserver/node';

import {
  TextDocument,
} from 'vscode-languageserver-textdocument';
import Httl from 'httl-core';
import { HttlDocument } from 'httl-core/dist/document';
import { HttlLanguageServerProvider } from './httl-provider';

export class HttlDocumentsProvider extends HttlLanguageServerProvider {
  public readonly documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

  constructor(
    connection: _Connection,
    private readonly httl: Httl
  ) {
    super(connection);
    this.documents.listen(connection);

    this.subscribe(adapter =>
      this.documents.onDidOpen(adapter(this.onDidOpen))
    );

    this.subscribe(adapter =>
      this.documents.onDidChangeContent(adapter(this.onDidChangeContent))
    );
  }

  public get(uri: string, selection?: string): HttlDocument & { origin: TextDocument } {
    const document = this.documents.get(uri);
    if (!document && !selection) {
      throw new Error('Document not found');
    }

    const content = document?.getText() || selection;

    // TODO: temporary solution
    const doc = this.httl.load(uri).sync(content) as any;
    doc.origin = document;

    return doc;
  }

  private onDidOpen = (e: TextDocumentChangeEvent<TextDocument>) => {
    this.httl.load(e.document.uri);
  };

  private onDidChangeContent = async (change: TextDocumentChangeEvent<TextDocument>) => {
    try {
      await this.get(change.document.uri).validate();
    } catch (error) {
      this.connection.console.error(error as any);
    }
  };
}