import { ApiEndpoint, ApiSpec } from "../../../extensions";
import { CompletionContext } from "../completion-context";
import { CompletionItem, CompletionItemKind } from "../completion-item";
import { CompletionProvider } from "./completion-provider";

interface IEndpointFilter {
  method: string;
  path: string;
  range: { start: number, end: number };
}


export class ApiSpecEndpointCompletionProvider extends CompletionProvider {
  constructor(
    private readonly spec: ApiSpec,
    private readonly filter?: IEndpointFilter
  ) {
    super()
  }

  public override async completion(context: CompletionContext): Promise<CompletionItem[]> {
    const endpoints = this.spec.getEndpoints()

    const filtered: ApiEndpoint[] = []
    const rest: ApiEndpoint[] = []
    endpoints.forEach(endpoint => {
      if (
        (!this.filter?.method || endpoint.method === this.filter.method) &&
        (!this.filter?.path || endpoint.path.toLocaleLowerCase().includes(this.filter.path.toLocaleLowerCase()))
      ) {
        filtered.push(endpoint)
      }
      else {
        rest.push(endpoint)
      }
    });

    const filteredCompletion = filtered.map(endpoint => {
      const additionalTextEdits = this.filter
        ? [
          {
            range: {
              start: { line: context.position.line, character: this.filter.range.start },
              end: { line: context.position.line, character: this.filter.range.end },
            },
            newText: ''
          },
        ]
        : []

      return {
        label: endpoint.getMethodAndPath(),
        labelDetails: { description: endpoint.operationId },
        sortText: '1.endpoints.' + endpoint.getMethodAndPath(),
        filterText: endpoint.path,
        detail: endpoint.summary,
        additionalTextEdits,
        kind: CompletionItemKind.Interface,
      } satisfies CompletionItem
    })

    const restCompletion = rest.map(endpoint => {
      const additionalTextEdits = this.filter
        ? [
          {
            range: {
              start: { line: context.position.line, character: this.filter.range.start },
              end: { line: context.position.line, character: this.filter.range.end },
            },
            newText: ''
          },
        ]
        : [];

      return {
        label: endpoint.getMethodAndPath(),
        labelDetails: { description: endpoint.operationId },
        sortText: '2.endpoints.' + endpoint.getMethodAndPath(),
        detail: endpoint.summary,
        additionalTextEdits,
        kind: CompletionItemKind.Interface,
      }
    })

    return [
      ...filteredCompletion,
      ...restCompletion
    ]
  }
}