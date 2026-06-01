import {
  BrowserMessageReader,
  BrowserMessageWriter,
  ProposedFeatures,
  createConnection,
} from 'vscode-languageserver/browser';

import { FetchHttpClient } from 'httl-core';
import { configureServer } from './configure-server';

/**
 * Start the HTTL language server inside a Web Worker.
 * Call this from the worker's top-level scope, passing `self`.
 *
 * `workerScope` is intentionally untyped so this package does not need the
 * DOM/WebWorker lib (it ships alongside Node types). The caller (the website
 * worker) provides the typed `self`.
 */
export function startBrowserServer(workerScope: any) {
  const reader = new BrowserMessageReader(workerScope);
  const writer = new BrowserMessageWriter(workerScope);
  const connection = createConnection(ProposedFeatures.all, reader, writer);

  configureServer(connection, { httpClient: new FetchHttpClient() });

  connection.listen();
  return connection;
}
