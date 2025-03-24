import React from 'react';

import { HttlEditor } from '../../../../components/editor';

import { useProjectModel } from '../project.model';
import * as s from './prestart.styles';

export const Prestart: React.FC = ({ }) => {
  const model = useProjectModel(({ prestart, projectState, updatePrestartScript, updateState }) =>
    ({ prestart, projectState, updatePrestartScript, updateState }));

  return (
    <s.Container>
      <s.Label>
        Prestart script
      </s.Label>
      <s.Editor
        height={model.projectState?.prestartHeight}
        onResize={prestartHeight => model.updateState({ prestartHeight })}
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