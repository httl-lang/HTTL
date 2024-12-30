
import vscode, { } from 'vscode';

import { HttlLanguageClient } from '..';
import { Lang } from 'httl-core';
import { HttlExtensionContext } from '../../common';

export class HttlInlineCompletionItemProvider {
  public static register(httlContext: HttlExtensionContext, client: HttlLanguageClient) {
    const inlineProvider = vscode.languages.registerInlineCompletionItemProvider(
      { scheme: 'file', language: Lang.LANG_ID },
      {
        async provideInlineCompletionItems(document, position, context, token) {
          try {
            const lspCompletionItems = await client.sendInlineCompletion(document.uri.toString(), position);
            if (!lspCompletionItems?.length) {
              return [];
            }

            const inlineCompletions = lspCompletionItems.map(item => {
              const insertText = item.insertText;
              if (typeof insertText === 'string') {
                return new vscode.InlineCompletionItem(insertText);
              }
              return null;
            }).filter(Boolean);

            return new vscode.InlineCompletionList(inlineCompletions as vscode.InlineCompletionItem[]);
          } catch (error) {
            console.error('Error fetching LSP completions:', error);
            return [];
          }
        }
      }
    );

    httlContext.ext.subscriptions.push(inlineProvider);
  }
}