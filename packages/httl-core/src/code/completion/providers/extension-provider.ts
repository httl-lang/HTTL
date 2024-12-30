import { Position } from "../../../common";
import { extensions } from "../../../extensions";
import { CompletionItem, CompletionItemKind } from "../completion-item";


export class ExtensionCompletionProvider {
  public static completion(position: Position, filter?: string): CompletionItem[] {
    let names = Object.keys(extensions);

    const extensionsList = names.map(ext => ({
      label: '@' + ext,
      sortText: '2.extensions.' + ext,
      textEdit: {
        range: {
          start: { line: position.line, character: Math.max(position.column - 1, 0) },
          end: { line: position.line, character: position.column + ext.length },
        },
        newText: '@' + ext,
      },
      kind: CompletionItemKind.Property,
    } satisfies CompletionItem));

    return extensionsList;
  }
}