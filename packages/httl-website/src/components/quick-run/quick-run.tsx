'use client';

import React, { useRef, useState } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'

import { HttlEditor, HttlEditorRef } from "../editor";
import { ResponseViewer } from "../response-viewer";

import * as s from './quick-run.styles';
import Button from "../button";
import Loader from "../loader/loader";
import { examples } from "./examples";


export default function QuickRun() {
  const editorRef = useRef<HttlEditorRef>(null);

  const [exampleIndex, setExampleIndex] = useState(0);
  const [inProgress, setInProgress] = useState(false)
  const [result, setResult] = useState();


  return (
    <s.Container>
      <s.Examples>
        <Button onClick={() => setExampleIndex((exampleIndex - 1 + examples.length) % examples.length)}>
          {/* @ts-ignore  */}
          <ChevronLeftIcon className="block size-6" />
        </Button>
        <span className="text-slate-500">{examples[exampleIndex].title}</span>
        <Button onClick={() => setExampleIndex((exampleIndex + 1) % examples.length)}>
          {/* @ts-ignore  */}
          <ChevronRightIcon className="block size-6" />
        </Button>
      </s.Examples>
      <s.Main>
        {inProgress && <s.Loading />}
        <s.Editor>
          <s.RunButton disabled={inProgress} onClick={() => editorRef.current?.runScript()}>
            {
              inProgress
                ? <Loader />
                : <img src="/run.svg" alt="httl" />
            }
          </s.RunButton>
          <HttlEditor
            ref={editorRef}
            value={examples[exampleIndex].code}
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
      </s.Main>
    </s.Container>
  );
}
