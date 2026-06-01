import { startBrowserServer } from 'httl-lsp/browser';
import { DemoHttpClient } from './demo-http-client';

// `self` is the worker global scope at runtime. startBrowserServer accepts it
// untyped so this file does not need the WebWorker TS lib alongside the DOM lib.
// The DemoHttpClient mocks the static site's demo API and delegates the rest.
startBrowserServer(self, new DemoHttpClient());
