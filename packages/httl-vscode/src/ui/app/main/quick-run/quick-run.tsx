import React from 'react';
import { Link } from 'react-router';

import Button from '../../../components/button';
import { HttlEditor } from '../../../components/editor';

import { QuickRunContext, useQuickRunModel } from './quick-run.model';
import * as s from './quick-run.styles';
import LogoSvg from './run.svg';


const _QuickRunView: React.FC = () => {
  const model = useQuickRunModel(({ run, setScript, script }) => ({ run, setScript, script }));

  return (
    <s.Container>
      <s.Panel>
        <s.Description>
          Quick Run
          <Button onClick={() => model.run(model.script)}>
            <LogoSvg />
          </Button>
        </s.Description>
        <s.Editor>
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
          />
        </s.Editor>
      </s.Panel>
      <s.Note>
        * Quick Run lacks some features available in the main editor. For the full feature set, visit <Link to="/main/tutorials">Tutorials</Link>
      </s.Note>
    </s.Container>
  );
};

export const QuickRunView = () => <QuickRunContext><_QuickRunView /></QuickRunContext>;