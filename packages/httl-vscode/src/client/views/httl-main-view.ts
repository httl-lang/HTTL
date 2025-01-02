
import vscode from 'vscode';
import { constants, HttlExtensionContext } from '../../common';
import { Lang } from 'httl-core';
import { HttlBaseViewProvider } from './base-view';
import { HttlResponseViewProvider } from './httl-response-view';
import { HttlLanguageClient } from '../httl-language-client';

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


        await this.responseView.show();
        await this.responseView.setProgress(constants.QUICK_RUN_DOCUMENT_NAME, true);

        const response = await this.client.sendRun(
          constants.QUICK_RUN_DOCUMENT_NAME,
          messagefromUI.payload,
        );
        await this.responseView.setResponse(constants.QUICK_RUN_DOCUMENT_NAME, response);
        return;
      }

      case 'save-state': {
        const { global, state: { key, value } } = messagefromUI.payload;
        this.context.saveState(`ui.main.${key}`, value, global);
        return;
      }

      case 'set-focus': {
        await this.responseView.changeActiveEditor(constants.QUICK_RUN_DOCUMENT_NAME);
        return;
      }
    }
  }
}