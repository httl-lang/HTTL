import { HttlExtensionContext } from '../../../../../common';
import * as vscode from 'vscode';

export class ProjectFileWatcher {

  public static register = (httlContext: HttlExtensionContext, pattern: string) => (
    { onDidChange }: {
      onDidChange: (uri: string) => void,
    }
  ) => {
    const rootDir = httlContext.getWorkspaceDirectory();

    if (!rootDir) {
      return;
    }

    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(rootDir, pattern)
    );

    // Register event handlers
    httlContext.ext.subscriptions.push(
      watcher,
      watcher.onDidChange(uri => onDidChange(uri.path.replace(rootDir.path, '.'))),
    );
  };
}