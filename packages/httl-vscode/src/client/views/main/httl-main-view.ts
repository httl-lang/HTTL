
import vscode from 'vscode';
import { HttlExtensionContext } from '../../../common';
import { Lang } from 'httl-core';
import { HttlBaseViewProvider } from '../base-view';
import { HttlResponseViewProvider } from '../response/httl-response-view';
import { HttlLanguageClient } from '../../httl-language-client';
import { HttlRunCommand } from '../../commands/run-command';
import { HttlProjectService } from './services/project';
import { QuickRunService } from './services/quick-run';

export class HttlMainViewProvider extends HttlBaseViewProvider {
  public static readonly viewType = 'httlMainView';

  constructor(
    context: HttlExtensionContext,
    private readonly client: HttlLanguageClient
  ) {
    const projectService = new HttlProjectService(context, {
      run: async (script: string, source: string) => {
        await this.sendRunCommand(script, source);
      },
      postMessage: async (command: string, props: any) => {
        await this.postMessage({
          command: command as any,
          ...props,
        });
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
}