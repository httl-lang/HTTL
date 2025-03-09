import React from 'react';
import { VscClose } from "react-icons/vsc";

import { HttlEditor, Viewer } from '../../../components/editor';
import Button from '../../../components/button';

import { WorkspaceContext, useWorkspaceModel } from './workspace.model';
import * as s from './workspace.styles';
import RunSvg from './run.svg';
import { VscSparkle } from "react-icons/vsc";
import { ProjectSelector } from './project-selector';
import { EndpointsPanel } from './endpoints-panel';
import { PrestartPanel } from './prestart-panel';

const _WorkspaceView: React.FC = () => {
  const model = useWorkspaceModel(({ startWorkspaceAnalyzing, inProgress, hasControllers }) =>
    ({ startWorkspaceAnalyzing, inProgress, hasControllers }));

  return (
    <s.Container>
      <s.Panel title="HTTL Projects">
        <ProjectSelector />
        <PrestartPanel />
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

export const WorkspaceView = () => <WorkspaceContext><_WorkspaceView /></WorkspaceContext>;