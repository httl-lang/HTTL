import { Lang } from "../../../common";
import { HttpHeaderNameRt, HttpHeaderValueRt } from "../../../runtime/runtime-objects";
import { CompletionContext } from "../completion-context";
import { CompletionItem, CompletionItemKind } from "../completion-item";
import { CompletionProvider } from "./completion-provider";


export class HttpHeaderValueCompletionProvider extends CompletionProvider {
  private readonly name: HttpHeaderNameRt;
  private readonly value?: HttpHeaderValueRt;

  constructor(props: { name: HttpHeaderNameRt; value?: HttpHeaderValueRt; }) {
    super();
    this.name = props.name;
    this.value = props.value;
  }

  public override async completion(context: CompletionContext): Promise<CompletionItem[]> {
    let headerValues = Lang.allHeaders
      .filter(h => h.header.toLocaleLowerCase() === this.name.name.toLocaleLowerCase())
      .flatMap(h => {
        return h.values.map(v => ({
          label: v,
          sortText: '5.headers.' + h.header,
          kind: CompletionItemKind.Field,
        }));
      });

    return headerValues;
  }
}