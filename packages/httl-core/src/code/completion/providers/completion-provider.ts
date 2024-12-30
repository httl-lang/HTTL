import { CompletionContext } from "../completion-context";
import { CompletionItem } from "../completion-item";


export abstract class CompletionProvider {
  public abstract completion(context: CompletionContext): Promise<CompletionItem[]>
}