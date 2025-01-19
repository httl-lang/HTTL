'use client';

import { useState } from "react";

import { HttlEditor } from "../editor";
import { ResponseViewer } from "../response-viewer";

import * as s from './quick-run.styles';

export default function QuickRun() {
  const [inProgress, setInProgress] = useState(false)
  const [result, setResult] = useState();

  return (
    <s.Container>
      <s.Editor>
        <HttlEditor
          value="get https://jsonplaceholder.typicode.com/todos/1"
          options={{
            overviewRulerLanes: 0,
            lineNumbers: 'off',
            lineDecorationsWidth: 0,
            glyphMargin: false,
            folding: false,
            scrollBeyondLastLine: false,
            renderLineHighlight: "none",
          }}
          onExecuting={(status) => setInProgress(status)}
          onExecuted={(result) => setResult(result)}
        />
      </s.Editor>
      <s.Response>
        <ResponseViewer inProgress={inProgress} output={result} />
      </s.Response>
    </s.Container>
  );
}
