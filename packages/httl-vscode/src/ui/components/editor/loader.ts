
export function editorInit(baseUri: string) {
  self.MonacoEnvironment = {
    baseUrl: `${baseUri}`,
    getWorker: function (moduleId, label: 'json' | 'css' | 'html' | 'typescript' | 'javascript' | 'default') {
      const workerContent = {
        json: `importScripts('${baseUri}/json.worker.js');`,
        css: `importScripts('${baseUri}/css.worker.js');`,
        html: `importScripts('${baseUri}/html.worker.js');`,
        typescript: `importScripts('${baseUri}/ts.worker.js');`,
        javascript: `importScripts('${baseUri}/ts.worker.js');`,
        default: `importScripts('${baseUri}/editor.worker.js');`,
      };

      const script = workerContent[label] || workerContent.default;

      return new Worker(URL.createObjectURL(new Blob(
        [script],
        { type: 'application/javascript' })
      ));
    },
  };
}
