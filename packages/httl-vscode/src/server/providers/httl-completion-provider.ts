import {
  CompletionItem,
  TextDocumentPositionParams,
  _Connection,
  Position
} from 'vscode-languageserver/node';

import { HttlLanguageServerProvider } from './httl-provider';
import { HttlDocumentsProvider } from './httl-documents-provider';

export class HttlCompletionProvider extends HttlLanguageServerProvider {

  constructor(
    connection: _Connection,
    private readonly documents: HttlDocumentsProvider,
  ) {
    super(connection);

    this.subscribe(adapter =>
      connection.onCompletion(adapter(this.onCompletion))
    );

    this.subscribe(adapter =>
      connection.onCompletionResolve(adapter(this.onCompletionResolve))
    );

    this.subscribe(adapter =>
      connection.onRequest('custom/request:inline_completion', adapter(this.onInlineCompletion))
    );
  }

  private onCompletion = async (_textDocumentPosition: TextDocumentPositionParams): Promise<CompletionItem[]> => {
    const { line, character: column } = _textDocumentPosition.position;

    const completions = await this.documents
      .get(_textDocumentPosition.textDocument.uri)
      .completion({ line, column });

    return completions;
  };

  private onCompletionResolve = (item: CompletionItem): CompletionItem | undefined => {
    return undefined;
  };

  private onInlineCompletion = async ({ documentUri, position }: any) => {
    const { line, character: column } = position as Position;

    const result =
      await this.documents.get(documentUri)
        .completion({ line, column }, true);

    return result;
  };
}
