import ReactDOM from 'react-dom/client';

import App from './app';
import { AppData } from '../common';
import { editorInit } from './components/editor';

declare global {
  function acquireVsCodeApi(): {
    postMessage: (message: unknown) => void;
    getState: <T = unknown>() => T | undefined;
    setState: <T = unknown>(state: T) => void;
  };

  const appData: AppData;
  const vscode: ReturnType<typeof acquireVsCodeApi>;
}

editorInit(appData.baseUri);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <App />
);


