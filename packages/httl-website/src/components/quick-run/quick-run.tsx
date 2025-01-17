'use client';

import Image from "next/image";
import { HttlEditor } from "../editor";

export default function QuickRun() {
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
        />
      </div>
      <div style={{ width: 400, height: 300 }}>
        // REsponse
      </div>
    </div>
  );
}
