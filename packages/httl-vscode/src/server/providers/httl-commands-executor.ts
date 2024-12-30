import { _Connection, Diagnostic, DocumentDiagnosticParams, DocumentDiagnosticReport, DocumentDiagnosticReportKind } from "vscode-languageserver";
import { HttlDocumentsProvider } from "./httl-documents-provider";

import { HttlLanguageServerProvider } from "./httl-provider";
import { } from "httl-core";

export class HttlCommandsExecutor extends HttlLanguageServerProvider {

  constructor(
    connection: _Connection,
    private readonly documents: HttlDocumentsProvider
  ) {
    super(connection);
    this.subscribe(adapter =>
      this.connection.onRequest('custom/request:run', adapter(this.onRun))
    );
  }

  private onRun = async ({ documentUri, selection }: any) => {
    const document = this.documents.get(documentUri, selection);
    const result = await document.run();
    await this.connection.sendDiagnostics({ uri: documentUri, diagnostics: [] });

    // TODO: Reuse diagnostic provider here
    if (result.hasErrors()) {
      const { errors = [] } = result.toOutput();

      const diagnostics = [];

      for (const error of errors) {
        const diagnostic: Diagnostic = {
          severity: error.severity,
          range: {
            start: document.origin.positionAt(error.token.start),
            end: document.origin.positionAt(error.token.end)
          },
          message: `${error.error}` || 'Unknown error',
        };

        diagnostics.push(diagnostic);
      }

      await this.connection.sendDiagnostics({ uri: documentUri, diagnostics });
    }

    return result.toOutput();
  };
}