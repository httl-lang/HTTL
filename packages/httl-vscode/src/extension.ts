
import vscode from 'vscode';
import { HttlLanguageClient, HttlRunCommand } from './client';
import { HttlInlineCompletionItemProvider } from './client/providers/httl-inline-completion-provider';
import { Logger } from './common/logger';
import { HttlExtensionContext } from './common';
import { HttlResponseViewProvider } from './client/views/response';
import { HttlMainViewProvider } from './client/views/main';
import { serializeError } from 'httl-common';

let logger!: Logger;

export async function activate(context: vscode.ExtensionContext) {
	logger = new Logger(context);
	try {
		const httlContext = new HttlExtensionContext(context, logger);
		const client = HttlLanguageClient.initialize(httlContext);

		// * Providers
		HttlInlineCompletionItemProvider.register(httlContext, client);

		// * UI
		const httlResponseView = new HttlResponseViewProvider(httlContext);
		const httlMainView = new HttlMainViewProvider(httlContext, client);

		// * Commands
		new HttlRunCommand(httlContext, client, httlResponseView);

		// Start the client. This will also launch the server
		client.start();

		logger.info('Httl extension activated');
	} catch (error) {
		logger.error('Error activating Httl extension:', JSON.stringify(serializeError(error)));
	}
}

export async function deactivate(context: vscode.ExtensionContext) {
	logger.info('Httl extension deactivated');
	await HttlLanguageClient.current.dispose();
}