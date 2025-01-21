'use client';

import React, { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import { initialize as initializeVScodeServices } from './vscode-services'
import { activate as activateHttlExtenssion, HttlExtensionApi } from './httl-extension'
import { Editor, EditorProps, EditorRef } from "./editor";

interface HttlEditorProps extends EditorProps {
  onExecuting: (status: boolean) => void;
  onExecuted: (result: any) => void;
  children?: never;
}

export interface HttlEditorRef {
  runScript: () => void;
}

export const HttlEditor = forwardRef<HttlEditorRef, HttlEditorProps>((props: HttlEditorProps, ref: React.Ref<HttlEditorRef>) => {
  const [ready, setReady] = useState(false);
  const [api, setApi] = useState<HttlExtensionApi>();
  const singleRunRef = useRef(false);
  const editorRef = useRef<EditorRef>(null);

  useImperativeHandle(ref, () => ({
    runScript: () => {
      editorRef.current?.focus();
      api?.commands.runScript();
    }
  }));

  useEffect(() => {
    if (singleRunRef.current) return;
    singleRunRef.current = true;

    Promise.all([
      initializeVScodeServices(),
      activateHttlExtenssion(),
    ])
      .then(([_, httl]) => {
        setReady(true);
        setApi(httl);
        httl.commands.onExecuting((status) => {
          props.onExecuting(status);
        })
        httl.commands.onExecuted((result) => {
          props.onExecuted(result);
        })
      })
  }, []);

  if (!ready)
    return <>...Loading</>

  return (
    <Editor {...props} ref={editorRef} />
  );
});