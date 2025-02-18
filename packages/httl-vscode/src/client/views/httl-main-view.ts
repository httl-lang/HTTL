
import vscode from 'vscode';
import { constants, HttlExtensionContext } from '../../common';
import { Lang } from 'httl-core';
import { HttlBaseViewProvider } from './base-view';
import { HttlResponseViewProvider } from './httl-response-view';
import { HttlLanguageClient } from '../httl-language-client';
import { HttlRunCommand } from '../commands/run-command';

export class HttlMainViewProvider extends HttlBaseViewProvider {
  public static readonly viewType = 'httlMainView';

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
    }
  }
}