
import vscode from 'vscode';
import { constants, HttlExtensionContext } from '../../common';
import { Lang } from 'httl-core';
import { HttlBaseViewProvider } from './base-view';
import { HttlResponseViewProvider } from './httl-response-view';
import { HttlLanguageClient } from '../httl-language-client';
import { HttlRunCommand } from '../commands/run-command';
import { OpenapiSpecAgent } from '../../ai/agents/openapi-spec-agent';

export class HttlMainViewProvider extends HttlBaseViewProvider {
  public static readonly viewType = 'httlMainView';

  private readonly openapiSpecAgent = new OpenapiSpecAgent(this.context);

  constructor(
    context: HttlExtensionContext,
    private readonly client: HttlLanguageClient,
    private readonly responseView: HttlResponseViewProvider,
  ) {
    super(context, HttlMainViewProvider.viewType, {
      view: 'main',
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

      case 'run-lm': {
        for await (const result of this.openapiSpecAgent.run()) {
          await this.postMessage({
            // @ts-ignore
            command: 'run-lm-result',
            // @ts-ignore
            payload: result,
          });
        }

        return;
      }
    }
  }
}