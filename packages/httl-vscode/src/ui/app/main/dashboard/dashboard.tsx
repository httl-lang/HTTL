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

const _DashboardView: React.FC = () => {
  const model = useDashboardModel(({ startWorkspaceAnalyzing, projects, controllers, projectsProgress: apiProjectsProgress, inProgress, hasControllers }) =>
    ({ startWorkspaceAnalyzing, projects, controllers, inProgress, apiProjectsProgress, hasControllers }));

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
      <s.Label center>
        Endpoints
      </s.Label>

      {
        model.controllers.map((controller) => (
          <>

            <s.Label>
              {controller.tag} ({controller.name})
            </s.Label>
            {
              Object.entries(controller.spec?.paths || {}).flatMap(([url, methods]) => (
                Object.entries(methods as any).map(([method, spec]) => (
                  <s.Panel>
                    {method} {url}
                    {/* GET /api/{controller.name} <RunSvg /> */}
                  </s.Panel>
                ))

              ))
            }
          </>
        ))
      }
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