import React, { useEffect, useMemo, useRef } from "react";
import * as monaco from "monaco-editor";
import yaml from 'js-yaml';

interface ViewerProps {
  value: string | [string, string][] | object;
  onChange?: (value: string) => void;
  language?: string;
  theme?: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
  relayoutAfterValueChange?: boolean;
}

const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  readOnly: true,
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
  lineDecorationsWidth: 0,
  glyphMargin: false,
};

export const Viewer: React.FC<ViewerProps> = ({
  value,
  onChange,
  language = "json",
  theme = "vs-dark",
  options = defaultOptions,
  relayoutAfterValueChange = false,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const formatedValue = useMemo(() => {
    // TODO: very dirty 
    try {
      if (language === 'json') {
        return typeof value === 'string'
          ? JSON.stringify(JSON.parse(value), null, 2)
          : JSON.stringify(value, null, 2);
      }

      if (language === 'yaml') {
        if (value instanceof Array) {
          return value.map(([key, val]) => `${key}: ${val}`).join('\n');
        }

        return yaml.dump(value, { lineWidth: Infinity }).trimEnd();
      }
    } catch (error) {
      console.error(error);
    }

    return typeof value === 'string'
      ? value
      : JSON.stringify(value, null, 2);

  }, [value]);

  useEffect(() => {
    if (containerRef.current) {
      // Initialize the Monaco Editor
      const editor = editorRef.current = monaco.editor.create(containerRef.current, {
        value: formatedValue || "",
        language,
        theme,
        ...defaultOptions,
        ...options,
      });

      // Set up event listener for content changes
      const model = editor.getModel();
      model?.onDidChangeContent(() => {
        const newValue = model.getValue();
        onChange?.(newValue);
      });

      if (relayoutAfterValueChange) {
        // Adjust the height to fit content
        editor.onDidContentSizeChange(() => {
          const contentHeight = editor.getContentHeight();
          const lineHeight = Math.min(contentHeight + 5, 300); // TODO: hardcoded as of now
          containerRef.current!.style.height = `${lineHeight}px`;
          editor.layout();
        });
      }

      return () => {
        // Cleanup the editor on unmount
        editorRef.current?.dispose();
      };
    }
  }, [language, theme, options, relayoutAfterValueChange]);


  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};
