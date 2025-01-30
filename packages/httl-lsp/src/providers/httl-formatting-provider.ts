import { _Connection, DocumentFormattingParams, TextEdit } from "vscode-languageserver";
import { HttlDocumentsProvider } from "./httl-documents-provider";

import { HttlLanguageServerProvider } from "./httl-provider";

export class HttlFormattingProvider extends HttlLanguageServerProvider {

  constructor(
    connection: _Connection,
    private readonly documents: HttlDocumentsProvider
  ) {
    super(connection);

    this.subscribe(adapter =>
      this.connection.onDocumentFormatting(adapter(this.onFormat))
    );
  }

  private onFormat = async (params: DocumentFormattingParams): Promise<TextEdit[]> => {
    const document = this.documents.get(params.textDocument.uri);

    const formatedText =
      await document.format(params.options);

    return [
      {
        range: {
          start: { line: 0, character: 0 },
          end: {
            line: document.origin.lineCount - 1,
            character: Number.MAX_SAFE_INTEGER,
          },
        },
        newText: formatedText,
      },
    ];
  };
}