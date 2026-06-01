import { startBrowserServer } from 'httl-lsp/browser';

startBrowserServer(self as unknown as DedicatedWorkerGlobalScope);
