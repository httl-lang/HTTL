import React from 'react';
import { VscClose } from "react-icons/vsc";

import { HttlEditor, Viewer } from '../../../components/editor';
import Button from '../../../components/button';

import { DashboardContext, useDashboardModel } from './dashboard.model';
import * as s from './dashboard.styles';
import RunSvg from './run.svg';

const _DashboardView: React.FC = () => {
  const model = useDashboardModel(({ run, data, inProgress }) => ({ run, data, inProgress }));

  return (
    <s.Container>
      <s.Panel>
        <s.Description>
          Workspace APIs
          <Button progress={model.inProgress} onClick={() => model.run()}>
            <RunSvg />
          </Button>
        </s.Description>
        <s.ViewPanel>
          <Viewer
            value={model.data || ''}
            language='json'
            options={{
              overviewRulerLanes: 0,
              lineNumbers: 'off',
              wordWrap: 'on',
              wrappingIndent: 'indent',
              lineDecorationsWidth: 0,
              glyphMargin: false,
              folding: false,
              scrollBeyondLastLine: false,
            }}
          />
        </s.ViewPanel>
      </s.Panel>
    </s.Container>
  );
};

export const DashboardView = () => <DashboardContext><_DashboardView /></DashboardContext>;