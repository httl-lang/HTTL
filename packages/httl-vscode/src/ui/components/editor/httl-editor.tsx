import React, { useEffect, useMemo, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { httlLangInit, jwtLangInit } from "./loaders";

// Initialize the language providers
jwtLangInit();
httlLangInit(appData.baseUri);

interface EditorProps {
  value: string;
  onChange?: (value: string) => void;
  onRun?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  language?: string;
  theme?: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
  relayoutAfterValueChange?: boolean;
}

const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
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



export const HttlEditor: React.FC<EditorProps> = ({
  value,
  onChange,
  onRun,
  onFocus,
  onBlur,
  language = "httl",
  theme = "vs-dark",
  options = defaultOptions,
}) => {
  const [editorValue, setEditorValue] = useState(value);

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) { return; }

    // Initialize the Monaco Editor
    const editor = editorRef.current = monaco.editor.create(containerRef.current, {
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
      run: () => {
        const value = editor.getValue();
        onRun?.(value);
      },
    });

    // Set up event listener for content changes
    const model = editor.getModel();
    const onDidChangeContent = model?.onDidChangeContent(() => {
      const newValue = model.getValue();
      setEditorValue(newValue);

    });

    const onDidFocusEditorText = editor.onDidFocusEditorText(() => {
      onFocus?.();
    });

    const onDidBlurEditorText = editor.onDidBlurEditorText(() => {
      onBlur?.();
    });

    return () => {
      onDidFocusEditorText.dispose();
      onDidChangeContent?.dispose();
      onDidBlurEditorText.dispose();
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
