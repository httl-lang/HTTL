import React from 'react';

import { HttlEditor } from '../../../../components/editor';

import { useProjectModel } from '../project.model';
import * as s from './prestart.styles';
import { ResizePanel } from '../../../../components/resize-panel';
import { useProjectStateModel } from '../project-state.model';

export const Prestart: React.FC = ({ }) => {
  const model = useProjectModel(({ prestart, updatePrestartScript }) =>
    ({ prestart, updatePrestartScript }));

  const state = useProjectStateModel(({ prestartHeight, updateState }) =>
    ({ prestartHeight, updateState }));

  return (
    <s.Container>
      <s.Label>
        Prestart script
      </s.Label>
      <s.Editor
        height={state.prestartHeight}
        onResize={prestartHeight => state.updateState({ prestartHeight })}
      >
        <HttlEditor
          value={model.prestart || ''}
          options={{
            overviewRulerLanes: 0,
            lineNumbers: 'off',
            lineDecorationsWidth: 0,
            glyphMargin: false,
            folding: false,
            scrollBeyondLastLine: false,
            renderLineHighlight: "none",
          }}
          onChange={(script) => model.updatePrestartScript(script)}
          onRun={(script) => null}
          onFocus={() => null}
        />
      </s.Editor>
    </s.Container>
  );
};