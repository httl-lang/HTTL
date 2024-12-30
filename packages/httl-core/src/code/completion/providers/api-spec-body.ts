import { ApiSpec } from "../../../extensions";
import { CompletionContext } from "../completion-context";
import { CompletionItem, CompletionItemKind } from "../completion-item";
import { CompletionProvider } from "./completion-provider";

interface IEndpointFilter {
  method: string;
  path: string;
  range: { start: number, end: number };
}

export class ApiSpecBodyCompletionProvider extends CompletionProvider {

  constructor(
    private readonly spec: ApiSpec,
    private readonly filter: IEndpointFilter
  ) {
    super()
  }

  public override async completion(context: CompletionContext): Promise<CompletionItem[]> {
    const [endpoint] = this.spec.getEndpoints({
      method: this.filter.method,
      path: this.filter.path
    }) || []

    if (!endpoint || !endpoint?.requestBody)
      return []

    return [{
      insertText: endpoint.requestBody.generateBodyString(),
      kind: CompletionItemKind.Module,
      labelDetails: { description: endpoint.operationId },
      label: "body " + endpoint.requestBody.contentType
    }]
  }
}