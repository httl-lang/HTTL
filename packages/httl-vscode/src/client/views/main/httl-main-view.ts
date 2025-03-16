
import vscode from 'vscode';
import { constants, FileSearch, HttlExtensionContext } from '../../../common';
import { Lang } from 'httl-core';
import { HttlBaseViewProvider } from '../base-view';
import { HttlResponseViewProvider } from '../response/httl-response-view';
import { HttlLanguageClient } from '../../httl-language-client';
import { HttlRunCommand } from '../../commands/run-command';
import { ApiWorkspaceAgent } from '../../../ai/agents/api-workspace-agent';
import { HttlProjectService } from './services/project';
import { QuickRunService } from './services/quick-run';
import { ProjectFileWatcher } from "../../../client/providers/project-file-watcher";

export class HttlMainViewProvider extends HttlBaseViewProvider {
  public static readonly viewType = 'httlMainView';

  private readonly workspaceAgent = new ApiWorkspaceAgent(this.context);

  constructor(
    context: HttlExtensionContext,
    private readonly client: HttlLanguageClient
  ) {
    const projectService = new HttlProjectService({
      run: async (script: string, source: string) => {
        await this.sendRunCommand(script, source);
      }
    });

    super(
      context,
      HttlMainViewProvider.viewType,
      {
        view: 'main',
      },
      {
        project: projectService,
        quickRun: new QuickRunService({
          run: async (script: string, source: string) => {
            await this.sendRunCommand(script, source);
          }
        }),
      }
    );

    ProjectFileWatcher.register(context, '**/*.json')({
      onDidChange: async (filePath) => {
        if (projectService.isSync(filePath) === false) {
          await this.postMessage({
            command: 'reload-project',
            file: filePath,
          });
        }
      },
    });
  }

  public async highlightSection(panel: string, ...paths: string[]): Promise<void> {
    await this.show();
    await this.postMessage({
      command: 'highlight-section',
      payload: { panel, paths },
    });
  }

  protected override async handleUIMessages(messagefromUI: any): Promise<void> {
    switch (messagefromUI.command) {
      case 'create-example': {
        const document = await vscode.workspace.openTextDocument({
          content: messagefromUI.payload,
          language: Lang.LANG_ID,
        });

        vscode.window.showTextDocument(document);
        return;
      }

      case 'set-focus': {
        await this.responseView.changeActiveEditor(messagefromUI.file);
        return;
      }

      case 'start-workspace-analyzing': {
        await this.startWorkspaceAnalyzing(messagefromUI);
        return;
      }
    }
  }

  private get responseView() {
    return this.getView(HttlResponseViewProvider.viewType) as HttlResponseViewProvider;
  }

  private async sendRunCommand(script: string, documentName: string) {
    await HttlRunCommand.execute(
      this.responseView,
      this.client,
      script,
      documentName);
  }

  private async startWorkspaceAnalyzing(message: any) {
    try {
      for await (const result of this.workspaceAgent.analyze()) {
        await this.postMessage({
          command: result.command as any, //TODO: fix this
          payload: result.payload,
        });
      }
    } catch (error: any) {
      await this.postMessage({
        command: 'set-workspace-api-error',
        payload: error.message,
      });
    }
  }
}