import {
  BrowserMessageReader,
  BrowserMessageWriter,
  ProposedFeatures,
  createConnection,
} from 'vscode-languageserver/browser';

import { FetchHttpClient, IHttpClient } from 'httl-core';
import { configureServer } from './configure-server';

/**
 * Start the HTTL language server inside a Web Worker.
 * Call this from the worker's top-level scope, passing `self`.
 *
 * `workerScope` is intentionally untyped so this package does not need the
 * DOM/WebWorker lib (it ships alongside Node types). The caller (the website
 * worker) provides the typed `self`.
 *
 * `httpClient` defaults to a plain fetch client; callers may inject a wrapper
 * (e.g. to mock demo endpoints) as long as it implements IHttpClient.
 */
export function startBrowserServer(workerScope: any, httpClient: IHttpClient = new FetchHttpClient()) {
  const reader = new BrowserMessageReader(workerScope);
  const writer = new BrowserMessageWriter(workerScope);
  const connection = createConnection(ProposedFeatures.all, reader, writer);

  configureServer(connection, { httpClient });

  connection.listen();
  return connection;
}
