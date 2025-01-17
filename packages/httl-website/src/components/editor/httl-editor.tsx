'use client';

import React, { FC, useEffect, useRef, useState } from "react";

import { initialize as initializeVScodeServices } from './vscode-services'
import { activate as activateHttlExtenssion } from './httl-extension'
import { Editor, EditorProps } from "./editor";

export const HttlEditor = (props: EditorProps) => {
  const [ready, setReady] = useState(false);
  const singleRunRef = useRef(false);

  useEffect(() => {
    if (singleRunRef.current) return;
    singleRunRef.current = true;

    Promise.all([
      initializeVScodeServices(),
      activateHttlExtenssion(),
    ])
      .then(() => {
        setReady(true);
      })
  }, []);

  if (!ready)
    return <>...Loading</>

  return (
    <Editor {...props} />
  );
};