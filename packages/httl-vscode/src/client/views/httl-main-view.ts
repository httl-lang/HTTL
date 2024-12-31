
import vscode from 'vscode';
import { HttlExtensionContext, UIMessage } from '../../common';
import { Lang } from 'httl-core';
import { HttlBaseViewProvider } from './base-view';

export class HttlMainViewProvider extends HttlBaseViewProvider {
  public static readonly viewType = 'httlMainView';

  constructor(context: HttlExtensionContext) {
    super(context, HttlMainViewProvider.viewType, {
      view: 'main',
    });
  }
}