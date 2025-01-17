'use client';

const workerLoaders: Partial<Record<string, () => Worker>> = {
  TextEditorWorker: () => new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), { type: 'module' }),
  TextMateWorker: () => new Worker(new URL('@codingame/monaco-vscode-textmate-service-override/worker', import.meta.url), { type: 'module' }),
}

window.MonacoEnvironment = {
  getWorker: function (moduleId, label) {
    const workerFactory = workerLoaders[label]
    console.log('getWorker', moduleId, label, workerFactory);
    if (workerFactory != null) {
      return workerFactory()
    }
    throw new Error(`Unimplemented worker ${label} (${moduleId})`)
  }
}