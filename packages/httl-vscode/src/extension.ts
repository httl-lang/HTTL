
import vscode from 'vscode';
import { HttlLanguageClient, HttlRunCommand } from './client';
import { HttlInlineCompletionItemProvider } from './client/providers/httl-inline-completion-provider';
import { Logger } from './common/logger';
import { HttlExtensionContext } from './common';
import { HttlResponseViewProvider } from './client/views/httl-response-view';

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

		// * Commands
		const runCommand = new HttlRunCommand(httlContext, client, httlResponseView);

		// Start the client. This will also launch the server
		client.start();

		logger.info('Httl extension activated');
	} catch (error) {
		logger.error('Error activating Httl extension:', error);
	}
}

export async function deactivate(context: vscode.ExtensionContext) {
	logger.info('Httl extension deactivated');
	await HttlLanguageClient.current.dispose();
}