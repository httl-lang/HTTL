
import vscode from 'vscode';
import { HttlExtensionContext, UIMessage } from '../../common';
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
        const quickRunDocName = "quick-run-document";

        await this.responseView.show();
        await this.responseView.setProgress(quickRunDocName, true);

        const response = await this.client.sendRun(
          quickRunDocName,
          messagefromUI.payload,
        );
        await this.responseView.setResponse(quickRunDocName, response);
        return;
      }
      case 'save-state': {
        const { global, state: { key, value } } = messagefromUI.payload;
        this.context.saveState(`ui.main.${key}`, value, global);
        return;
      }
    }
  }
}