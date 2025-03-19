import { HttlExtensionContext } from '../../../../../common';
import * as vscode from 'vscode';

export class ProjectFileWatcher {

  public static register = (httlContext: HttlExtensionContext, pattern: string) => (
    { onDidChange }: {
      onDidChange: (uri: string) => void,
    }
  ) => {

    const rootDir = vscode.workspace.workspaceFolders![0];

    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(vscode.workspace.workspaceFolders![0], pattern)
    );

    // Register event handlers
    httlContext.ext.subscriptions.push(
      watcher,
      watcher.onDidChange(uri => onDidChange(uri.path.replace(rootDir.uri.path, '.'))),
    );
  };
}