import React, { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router';

import Button from '../../../components/button';
import { HttlEditor } from '../../../components/editor';

import { QuickRunContext, useQuickRunModel } from './quick-run.model';
import * as s from './quick-run.styles';
import RunSvg from './run.svg';

const _QuickRunView: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const model = useQuickRunModel(({ run, setScript, setFocus, saveSize, inProgress, size, script }) =>
    ({ run, setScript, setFocus, saveSize, inProgress, size, script }));

  const onResize = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const startY = e.clientY;
    const startHeight = editorRef.current!.offsetHeight;

    const onMouseMove = (e: any) => {
      const newHeight = startHeight + (e.clientY - startY);
      editorRef.current!.style.height = `${newHeight}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      model.saveSize(editorRef.current!.style.height);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  return (
    <s.Container>
      <s.Panel>
        <s.Description>
          Quick Run
          <Button progress={model.inProgress} onClick={() => model.run(model.script)}>
            <RunSvg />
          </Button>
        </s.Description>
        <s.Editor ref={editorRef} style={{ height: model.size }}>
          <HttlEditor
            value={model.script}
            options={{
              overviewRulerLanes: 0,
              lineNumbers: 'off',
              lineDecorationsWidth: 0,
              glyphMargin: false,
              folding: false,
              scrollBeyondLastLine: false,
            }}
            onChange={(script) => model.setScript(script)}
            onRun={(script) => model.run(script)}
            onFocus={() => model.setFocus()}
          />
        </s.Editor>
        <s.Resizer onMouseDown={onResize}>
          <s.Handler />
        </s.Resizer>
      </s.Panel>
      <s.Note>
        * Quick Run lacks some features available in the main editor. For the full feature set, visit <Link to="/main/tutorials">Tutorials</Link>
      </s.Note>
    </s.Container>
  );
};

export const QuickRunView = () => <QuickRunContext><_QuickRunView /></QuickRunContext>;