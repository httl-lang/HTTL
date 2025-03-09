
import vscode from 'vscode';
import { constants, HttlExtensionContext } from '../../common';
import { Lang } from 'httl-core';
import { HttlBaseViewProvider } from './base-view';
import { HttlResponseViewProvider } from './httl-response-view';
import { HttlLanguageClient } from '../httl-language-client';
import { HttlRunCommand } from '../commands/run-command';
import { ApiWorkspaceAgent } from '../../ai/agents/api-workspace-agent';


export class HttlMainViewApi {

  public async createExample(payload: string) {
    return vscode.workspace.openTextDocument({
      content: payload,
    });
  }
}

export class HttlMainViewProvider extends HttlBaseViewProvider {
  public static readonly viewType = 'httlMainView';

  private readonly workspaceAgent = new ApiWorkspaceAgent(this.context);

  constructor(
    context: HttlExtensionContext,
    private readonly client: HttlLanguageClient,
    private readonly responseView: HttlResponseViewProvider,
  ) {
    super(
      context,
      HttlMainViewProvider.viewType,
      {
        view: 'main',
      },
      new HttlMainViewApi()
    );
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

      case 'run-script': {
        await HttlRunCommand.execute(
          this.responseView,
          this,
          this.client,
          messagefromUI.payload,
          constants.QUICK_RUN_DOCUMENT_NAME,
          constants.QUICK_RUN_DOCUMENT_NAME);

        return;
      }

      case 'set-focus': {
        await this.responseView.changeActiveEditor(constants.QUICK_RUN_DOCUMENT_NAME);
        return;
      }

      case 'start-workspace-analyzing': {
        await this.startWorkspaceAnalyzing(messagefromUI);
        return;
      }
    }
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