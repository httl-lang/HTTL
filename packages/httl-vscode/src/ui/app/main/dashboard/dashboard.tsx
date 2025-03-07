import React from 'react';
import { VscClose } from "react-icons/vsc";

import { HttlEditor, Viewer } from '../../../components/editor';
import Button from '../../../components/button';

import { DashboardContext, useDashboardModel } from './dashboard.model';
import * as s from './dashboard.styles';
import RunSvg from './run.svg';
import { VscSparkle } from "react-icons/vsc";
import ComboBox from '../../../components/combobox';

const _DashboardView: React.FC = () => {
  const model = useDashboardModel(({ startWorkspaceAnalyzing, projects, controllers, apiProjectsProgress, inProgress, hasControllers }) =>
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
        {
          model.projects.length !== 0 &&
          <>
            <s.ApisPanel>
              <ComboBox options={model.projects} value={model.projects[0]} idField={'name'} valueField={'name'} />
            </s.ApisPanel>
            <s.Label>
              .httl
            </s.Label>
            <s.Editor style={{ height: 150 }}>
              <HttlEditor
                value={"@spec: :3000"}
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
          </>
        }
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