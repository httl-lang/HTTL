import { Lang } from "../../../common";
import { CompletionContext } from "../completion-context";
import { CompletionItem, CompletionItemKind } from "../completion-item";
import { CompletionProvider } from "./completion-provider";

export class KeywordsCompletionProvider extends CompletionProvider {
  public override async completion(context: CompletionContext): Promise<CompletionItem[]> {
    const keywords = Lang.KEYWORDS.map(keyword => ({
      label: keyword,
      sortText: '5.keywords.' + keyword,
      kind: CompletionItemKind.Operator,
    } satisfies CompletionItem));

    return keywords;
  }
}
