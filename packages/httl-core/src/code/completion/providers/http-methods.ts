import { Lang } from "../../../common";
import { CompletionContext } from "../completion-context";
import { CompletionItem, CompletionItemKind } from "../completion-item";
import { CompletionProvider } from "./completion-provider";

export class HttpMethodsCompletionProvider extends CompletionProvider {
  public override async completion(context: CompletionContext): Promise<CompletionItem[]> {
    const httpMethods = Lang.HTTP_METHODS.map(method => ({
      label: method,
      sortText: '4.http_methods.' + method,
      kind: CompletionItemKind.Function,
    } satisfies CompletionItem));

    return httpMethods;
  }
}
