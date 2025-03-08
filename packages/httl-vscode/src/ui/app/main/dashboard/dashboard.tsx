import React from 'react';
import { VscClose } from "react-icons/vsc";

import { HttlEditor, Viewer } from '../../../components/editor';
import Button from '../../../components/button';

import { DashboardContext, useDashboardModel } from './dashboard.model';
import * as s from './dashboard.styles';
import RunSvg from './run.svg';
import { VscSparkle } from "react-icons/vsc";
import ComboBox from '../../../components/combobox';
import { ProjectPanel } from './project-panel';
import { EndpointsPanel } from './endpoints-panel';

const _DashboardView: React.FC = () => {
  const model = useDashboardModel(({ startWorkspaceAnalyzing, inProgress, hasControllers }) =>
    ({ startWorkspaceAnalyzing, inProgress, hasControllers }));

  return (
    <s.Container expanded={model.hasControllers}>
      <s.Panel>
        <s.Header>
          Workspace APIs
          <Button progress={model.inProgress} onClick={() => model.startWorkspaceAnalyzing()}>
            <VscSparkle />
          </Button>
        </s.Header>
        <ProjectPanel />
      </s.Panel>
      <EndpointsPanel />
    </s.Container>
  );
};
{/* <s.ViewPanel>
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
        </s.ViewPanel> */}

export const DashboardView = () => <DashboardContext><_DashboardView /></DashboardContext>;