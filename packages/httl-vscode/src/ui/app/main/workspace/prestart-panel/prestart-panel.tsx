import React from 'react';

import { HttlEditor } from '../../../../components/editor';

import { useProjectModel } from '../project.model';
import * as s from './prestart-panel.styles';


export const PrestartPanel: React.FC = () => {
  const model = useProjectModel(({ prestart }) =>
    ({ prestart }));

  return (
    <s.Container>
      <s.Label>
        Prestart
      </s.Label>
      <s.Editor style={{ height: 150 }}>
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
          onChange={(script) => null}
          onRun={(script) => null}
          onFocus={() => null}
        />
      </s.Editor>
    </s.Container>
  );
};