import { CompletionContext } from "../completion-context";
import { CompletionItem, CompletionItemKind } from "../completion-item";
import { CompletionProvider } from "./completion-provider";

export class VariablesCompletionProvider extends CompletionProvider {
  public override async completion(context: CompletionContext): Promise<CompletionItem[]> {
    const envVariables = context.executor.runtime.context.env.getAllNames()
    const variables = context.executor.$variables.filter(x => x.name !== 'default').map(variable => variable.name);

    const result = [...new Set([
      ...envVariables,
      ...variables
    ])].map(variable => ({
      label: variable,
      sortText: '3.variables.' + variable,
      kind: CompletionItemKind.Variable,
    } satisfies CompletionItem))

    return result;
  }
}
