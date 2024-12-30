import { Position, RuntimeObject } from "../../common";
import { IRuntimeExecutor } from "../../runtime";
import { CompletionContext, CompletionTarget } from "./completion-context";
import { CompletionItem } from "./completion-item";


export class CompletionService {
  constructor(
    public readonly executor: IRuntimeExecutor,
  ) { }

  public async completion(position: Position, inline: boolean): Promise<CompletionItem[]> {
    const codeMap = this.executor.getCodeMap();

    const exactObject = codeMap.objectAt(position);
    if (exactObject) {
      return this.getCompletions(position, inline, exactObject, CompletionTarget.Current);
    }

    const closestLeftObjectAt = codeMap.closestLeftObjectAt(position)
    if (closestLeftObjectAt) {
      return this.getCompletions(position, inline, closestLeftObjectAt, CompletionTarget.Next);
    }

    return this.getCompletions(position, inline, this.executor.getProgram(), CompletionTarget.Current);
  }

  private async getCompletions(position: Position, inline: boolean, rtObject: RuntimeObject<any>, target: CompletionTarget): Promise<CompletionItem[]> {
    const context = new CompletionContext(this.executor, position, inline, rtObject);
    context.target = target;

    let providers = await rtObject.completion(context);
    providers = Array.isArray(providers) ? providers : [providers];
    const result = await Promise.all(
      providers.filter(Boolean).map(provider =>
        provider.completion(context)
      )
    )

    return result.flatMap(res => res);
  }
}