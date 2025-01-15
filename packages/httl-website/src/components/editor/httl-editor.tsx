'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";

import type { editor } from "monaco-editor";
import { runClient } from "./loader";
import * as monaco from 'monaco-editor';



interface EditorProps {
  value: string;
  onChange?: (value: string) => void;
  onRun?: (value: string) => void;
  onFocus?: () => void;
  language?: string;
  theme?: string;
  options?: editor.IStandaloneEditorConstructionOptions;
  relayoutAfterValueChange?: boolean;
}

const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
  readOnly: false,
  lineHeight: 18,
  minimap: { enabled: false },
  folding: true,
  showFoldingControls: 'mouseover',
  autoIndent: 'full',
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  tabSize: 2,
  insertSpaces: true,
  fontSize: 12,
};

const HttlEditor = ({
  value,
  onChange,
  onRun,
  onFocus,
  language = "httl",
  theme = "vs-dark",
  options = defaultOptions,
}: EditorProps) => {
  const [editorValue, setEditorValue] = useState("");

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) { return; }

    // import("monaco-editor").then((monaco) => {

    if (editorRef.current) return;
    // @ts-ignore - TODO: dirty hack
    editorRef.current = { dispose: () => { }, setValue: (value: string) => { } };

    // import("./loader").then(({ runClient }) => {
    runClient().then(() => {
      if (!containerRef.current) { return; }
      // const model = monaco.editor.createModel(value, language, monaco.Uri.parse("file://quick-run.httl"));

      // const editor = editorRef.current = monaco.editor.create(containerRef.current!, {
      //   model,
      //   // language,
      //   // theme,
      //   // ...defaultOptions,
      //   // ...options,
      // });

      // if (editorRef.current) return;

      const fileUri = monaco.Uri.file('quick-run.httl');

      // const fileSystemProvider = new RegisteredFileSystemProvider(false)
      // fileSystemProvider.registerFile(new RegisteredMemoryFile(fileUri, value))
      // const overlayDisposable = registerFileSystemOverlay(1, fileSystemProvider)

      // const modelRef = await monaco.editor.createModelReference(fileUri)

      // const editor = monaco.editor.create({ model: modelRef.object.textEditorModel })



      // // Initialize the Monaco Editor
      const editor = editorRef.current = monaco.editor.create(containerRef.current!, {
        value: value || "",
        language,
        theme,
        ...defaultOptions,
        ...options,
      });

      editor.addAction({
        id: "run-script",
        label: "Run Script",
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
          monaco.KeyCode.F5,
        ],
        run: (ed) => {
          const value = editor.getValue();

          ed.trigger(
            "httl",
            "custom/request:run",
            {
              selection: value,
              documentUri: "quick-run",
            }
          )
        },
      });

      // Set up event listener for content changes
      const model = editor.getModel();
      // const model = editor.crea
      const onDidChangeContent = model?.onDidChangeContent(() => {
        const newValue = model.getValue();
        setEditorValue(newValue);

      });

      const onDidFocusEditorText = editor.onDidFocusEditorText(() => {
        onFocus?.();
      });

    });
    // })
    // });

    return () => {
      // onDidFocusEditorText.dispose();
      // onDidChangeContent?.dispose();
      editorRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (value !== editorValue) {
      setEditorValue(value);
      editorRef.current?.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (value !== editorValue) {
      onChange?.(editorValue);
    }
  }, [editorValue]);


  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default HttlEditor;