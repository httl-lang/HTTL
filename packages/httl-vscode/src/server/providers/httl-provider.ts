import { Disposable } from "vscode";
import { _Connection } from "vscode-languageserver";

export abstract class HttlLanguageServerProvider {
  private static readonly _disposables: Disposable[] = [];

  constructor(
    protected readonly connection: _Connection
  ) { }

  protected subscribe = (event: (adapter: any) => Disposable) => {
    const disposableObject = event(this.handlerAdapter);
    HttlLanguageServerProvider._disposables.push(disposableObject);
  };

  private handlerAdapter = (handler: (...args: any[]) => Promise<any>) => {
    return async (...args: any[]) => {
      try {
        return await handler(...args);
      } catch (error) {
        console.error(error);
        this.connection.console.error(error as any);
      }
    };
  };
}
