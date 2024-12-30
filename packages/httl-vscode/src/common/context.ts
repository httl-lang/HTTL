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

  public dispose() {
    this._logger.dispose();
  }
}