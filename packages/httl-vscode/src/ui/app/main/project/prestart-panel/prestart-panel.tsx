import React from 'react';

import { HttlEditor } from '../../../../components/editor';

import { useProjectModel } from '../project.model';
import * as s from './prestart-panel.styles';
import { ResizePanel } from '../../../../components/resize-panel';

export const PrestartPanel: React.FC= ({ }) => {
  const model = useProjectModel(({ prestart, defaultHeight, updatePrestartScript }) =>
    ({ prestart, defaultHeight, updatePrestartScript }));

  return (
    <s.Container>
      <s.Label>
        Prestart script
      </s.Label>
      <ResizePanel height={model.defaultHeight + 'px'}>
        <HttlEditor
          value={model.prestart || ''}
          options={{
            overviewRulerLanes: 0,
            lineNumbers: 'off',
            lineDecorationsWidth: 0,
            glyphMargin: false,
            folding: false,
            scrollBeyondLastLine: false,
          }}
          onChange={(script) => model.updatePrestartScript(script)}
          onRun={(script) => null}
          onFocus={() => null}
        />
      </ResizePanel>
    </s.Container>
  );
};