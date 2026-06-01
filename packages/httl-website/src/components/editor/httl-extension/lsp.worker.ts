import { startBrowserServer } from 'httl-lsp/browser';

// `self` is the worker global scope at runtime. startBrowserServer accepts it
// untyped so this file does not need the WebWorker TS lib alongside the DOM lib.
startBrowserServer(self);
