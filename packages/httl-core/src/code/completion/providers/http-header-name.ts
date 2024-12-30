import { Lang } from "../../../common";
import { HttpHeaderRt } from "../../../runtime/runtime-objects";
import { CompletionContext } from "../completion-context";
import { CompletionItem, CompletionItemKind } from "../completion-item";
import { CompletionProvider } from "./completion-provider";
import { ExtensionCompletionProvider } from "./extension-provider";


export class HttpHeaderNameCompletionProvider extends CompletionProvider {
  constructor(
    private readonly header?: HttpHeaderRt
  ) {
    super();
  }

  public override async completion(context: CompletionContext): Promise<CompletionItem[]> {
    if (this.header) {
      const cutLength = this.header.headerRt.expr.token.lengthTo(context.position);
      const cuttedText = this.header.headerRt.name.slice(0, cutLength);

      if (this.header.isExt) {
        const extensionsList = ExtensionCompletionProvider.completion(context.position, cuttedText);
        return extensionsList;
      }

      return Lang.allHeaders.filter(h => h.header.toLocaleLowerCase().startsWith(cuttedText.toLocaleLowerCase())).map(h => {
        return {
          label: h.header,
          data: h.header,
          kind: CompletionItemKind.Field,
        };
      });
    }

    const extensionsList = ExtensionCompletionProvider.completion(context.position);

    const allHeaders = Lang.allHeaders.map(h => {
      return {
        label: h.header,
        data: h.header,
        kind: CompletionItemKind.Field,
      };
    });

    return [...extensionsList, ...allHeaders];
  }
}

