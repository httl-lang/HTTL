import * as vscode from 'vscode';
import { Logger } from './logger';

export class HttlExtensionContext {
  private _context: vscode.ExtensionContext;
  private _logger: Logger;

  constructor(context: vscode.ExtensionContext, logger: Logger) {
    this._context = context;
    this._logger = logger;
  }

  public get ext(): vscode.ExtensionContext {
    return this._context;
  }

  public get logger(): Logger {
    return this._logger;
  }

  public getWorkspaceDirectory(): vscode.Uri | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri;
  }

  public async saveState(key: string, value: any, global = false) {
    const state = global
      ? this._context.globalState
      : this._context.workspaceState;

    await state.update(key, value);
  }

  public getState(prefix: string, global = false): Record<string, any> {
    const state = global
      ? this._context.globalState
      : this._context.workspaceState;

    const keys = state.keys();

    return Object.fromEntries(
      keys
        .filter(key => key.startsWith(prefix))
        .map(key => [key.slice(prefix.length + 1), state.get(key)])
    );
  }

  public async clearState() {
    for (const key of this._context.globalState.keys()) {
      await this._context.globalState.update(key, undefined);
    }

    for (const key of this._context.workspaceState.keys()) {
      await this._context.workspaceState.update(key, undefined);
    }
  }

  public dispose() {
    this._logger.dispose();
  }
}