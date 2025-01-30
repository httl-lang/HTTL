import { _Connection, Diagnostic, DocumentDiagnosticParams, DocumentDiagnosticReport, DocumentDiagnosticReportKind } from "vscode-languageserver";
import { HttlDocumentsProvider } from "./httl-documents-provider";
import { HttlLanguageServerProvider } from "./httl-provider";

export class HttlDiagnosticsProvider extends HttlLanguageServerProvider {

  constructor(
    connection: _Connection,
    private readonly documents: HttlDocumentsProvider
  ) {
    super(connection);

    this.subscribe(adapter =>
      this.connection.languages.diagnostics.on(adapter(this.onDiagnostics))
    );
  }

  private onDiagnostics = async (params: DocumentDiagnosticParams) => {
    const document = this.documents.get(params.textDocument.uri);

    const { diagnostics } = await document.validate();
    await this.connection.sendDiagnostics({ uri: params.textDocument.uri, diagnostics: [] });

    const result: Diagnostic[] = [];

    for (const validation of diagnostics) {
      const diagnostic: Diagnostic = {
        severity: validation.severity,
        range: {
          start: document.origin.positionAt(validation.token.start),
          end: document.origin.positionAt(validation.token.end)
        },
        message: `${validation.error}` || 'Unknown error',
      };

      result.push(diagnostic);
    }

    return {
      kind: DocumentDiagnosticReportKind.Full,
      items: result
    } satisfies DocumentDiagnosticReport;
  };
}