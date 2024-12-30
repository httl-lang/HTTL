import { Lang } from 'httl-core';
import * as vscode from 'vscode';

export class Logger {
  private _outputChannel = vscode.window.createOutputChannel(Lang.LANG_NAME, { log: true });

  constructor(private readonly context: vscode.ExtensionContext) {
    context.subscriptions.push(this._outputChannel);
  }

  public error(message: string | Error, ...args: any[]) {
    this._outputChannel.error(message, args);
    vscode.window.showErrorMessage(message.toString());
  }

  public info(message: string) {
    this._outputChannel.info(message);
  }

  public trace(message: string) {
    this._outputChannel.trace(message);
  }

  public warn(message: string) {
    this._outputChannel.warn(message);
  }

  public dispose() {
    this._outputChannel.dispose();
  }
}