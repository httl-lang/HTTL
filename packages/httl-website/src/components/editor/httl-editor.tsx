'use client';

import React, { FC, useEffect, useRef, useState } from "react";

import { initialize as initializeVScodeServices } from './vscode-services'
import { activate as activateHttlExtenssion } from './httl-extension'
import { Editor, EditorProps } from "./editor";

interface HttlEditorProps extends EditorProps {
  onExecuting: (status: boolean) => void;
  onExecuted: (result: any) => void;
}

export const HttlEditor = (props: HttlEditorProps) => {
  const [ready, setReady] = useState(false);
  const singleRunRef = useRef(false);

  useEffect(() => {
    if (singleRunRef.current) return;
    singleRunRef.current = true;

    Promise.all([
      initializeVScodeServices(),
      activateHttlExtenssion(),
    ])
      .then(([_, httl]) => {
        setReady(true);
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
    <Editor {...props} />
  );
};