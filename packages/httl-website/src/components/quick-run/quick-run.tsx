'use client';

import React, { useRef, useState } from "react";

import { HttlEditor, HttlEditorRef } from "../editor";
import { ResponseViewer } from "../response-viewer";

import * as s from './quick-run.styles';
import Button from "../button";
import Loader from "../loader/loader";

export default function QuickRun() {
  const editorRef = useRef<HttlEditorRef>(null);
  const [inProgress, setInProgress] = useState(false)
  const [result, setResult] = useState();

  return (
    <s.Container>
      { inProgress && <s.Loading /> }
      <s.Editor>
        <s.ToolBar>
          <Button disabled={inProgress} onClick={() => editorRef.current?.runScript()}>
            {
              inProgress
                ? <Loader />
                : <img src="/run.svg" alt="httl" />
            }
          </Button>
        </s.ToolBar>
        <HttlEditor
          ref={editorRef}
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
