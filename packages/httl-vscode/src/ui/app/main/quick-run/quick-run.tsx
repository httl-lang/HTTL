import React from 'react';

import { QuickRunContext, useQuickRunModel } from './quick-run.model';
import * as s from './quick-run.styles';
import { HttlEditor } from '../../../components/editor';
import { WelcomeView } from '../../../components/welcome';

const _QuickRunView: React.FC = () => {
  const model = useQuickRunModel(({ run }) => ({ run }));

  return (
    <s.Container>
      <s.Panel>
        <s.Description>
          Write a script and press <code>Ctrl + Enter</code> to run it.
        </s.Description>
        <s.Editor>
          <HttlEditor
            value=""
            options={{
              overviewRulerLanes: 0,
              lineNumbers: 'off',
              lineDecorationsWidth: 0,
              glyphMargin: false,
              folding: false,
              scrollBeyondLastLine: false,
            }}
            onRun={(script) => model.run(script)}
          />
        </s.Editor>
      </s.Panel>
      <s.Placeholder>
        <WelcomeView />
      </s.Placeholder>
    </s.Container>
  );
};

export const QuickRunView = () => <QuickRunContext><_QuickRunView /></QuickRunContext>;