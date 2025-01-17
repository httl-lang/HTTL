'use client';

import React, { useEffect, useRef, useState } from "react";

import type { editor } from "monaco-editor";
import * as monaco from 'monaco-editor';

export interface EditorProps {
  value: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  language?: string;
  theme?: string;
  options?: editor.IStandaloneEditorConstructionOptions;
  relayoutAfterValueChange?: boolean;
}

const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
  readOnly: false,
  lineHeight: 20,
  minimap: { enabled: false },
  folding: true,
  showFoldingControls: 'mouseover',
  autoIndent: 'full',
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  tabSize: 2,
  insertSpaces: true,
  fontSize: 16,
};

export const Editor = ({
  value,
  onChange,
  onFocus,
  language = "httl",
  theme = "vs-dark",
  options = defaultOptions,
}: EditorProps) => {
  const [editorValue, setEditorValue] = useState("");

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || editorRef.current) {
      return;
    }

    // Initialize the Monaco Editor
    const editor = editorRef.current =
      monaco.editor.create(containerRef.current!, {
        value: value || "",
        language,
        theme,
        ...defaultOptions,
        ...options,
      });

    const model = editor.getModel();
    const onDidChangeContent = model?.onDidChangeContent(() => {
      const newValue = model.getValue();
      setEditorValue(newValue);
    });

    const onDidFocusEditorText = editor.onDidFocusEditorText(() => {
      onFocus?.();
    });

    return () => {
      // TODO: commented due to an issue at double rendering, fix this
      // onDidFocusEditorText.dispose();
      // onDidChangeContent?.dispose();
      // editorRef.current?.dispose();
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

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
  );
};
