import { AppData } from '../common';

declare global {
  function acquireVsCodeApi(): {
    postMessage: (message: unknown) => void;
    getState: <T = unknown>() => T | undefined;
    setState: <T = unknown>(state: T) => void;
  };

  const appData: AppData;
  const vscode: ReturnType<typeof acquireVsCodeApi>;

  const MonacoEnvironment: any;

}

export { };