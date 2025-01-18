'use client';

import Image from "next/image";
import { HttlEditor } from "../editor";
import { useState } from "react";

export default function QuickRun() {
  const [inProgress, setInProgress] = useState(false)
  const [result, setResult] = useState(null);

  return (
    <div style={{ width: 400, height: 300 }}>
      <div style={{ width: 400, height: 300 }}>
        <HttlEditor
          value="get https://jsonplaceholder.typicode.com/todos/1"
          options={{
            overviewRulerLanes: 0,
            lineNumbers: 'off',
            lineDecorationsWidth: 0,
            glyphMargin: false,
            folding: false,
            scrollBeyondLastLine: false,
          }}
          onExecuting={(status) => setInProgress(status)}
          onExecuted={(result) => setResult(result)}
        />
      </div>
      <div>
        {inProgress && <div>Executing...</div>}
        {result && <div>Result: {JSON.stringify(result)}</div>}
      </div>
    </div>
  );
}
