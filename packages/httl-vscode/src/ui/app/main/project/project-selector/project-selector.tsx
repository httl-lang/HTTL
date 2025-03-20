import React from 'react';
import { VscClose, VscRefresh, VscSparkle } from "react-icons/vsc";

import ComboBox from '../../../../components/combobox';
import Button from '../../../../components/button';

import { useProjectModel } from '../project.model';
import * as s from './project-selector.styles';


export const ProjectSelector: React.FC = () => {
  const model = useProjectModel(({ fileInfo, supportAgentAnalysis, agentProgress, reloadProject, resolveProjects, selectProject, closeProject, startAgentAnalysis, stopAgentAnalysis }) =>
    ({ fileInfo, supportAgentAnalysis, agentProgress, reloadProject, resolveProjects, selectProject, closeProject, startAgentAnalysis, stopAgentAnalysis }));

  return (
    <s.Container>
      <ComboBox
        placeholder='Select project'
        keyField='id'
        current={model.fileInfo}
        options={(search) => model.resolveProjects(search)}
        onChange={(project) => model.selectProject(project)}
        inProgress={model.agentProgress === 'project'}
        render={(item, isLabel) => (
          <s.Item nowrap={isLabel}>
            <s.Name>
              {item.name}
            </s.Name>
            <s.SubTitle short={isLabel}>
              {
                'path' in item
                  ? item.path
                  : item.specUrl
              }
            </s.SubTitle>
          </s.Item>
        )}
        buttons={() => (
          model.supportAgentAnalysis
            ? (
              <Button
                title='Run the Copilot analysis.'
                onClick={(stop) => stop
                  ? model.stopAgentAnalysis()
                  : model.startAgentAnalysis()
                }
                allowStop
              >
                <VscSparkle />
              </Button>
            )
            : (
              <Button
                title='Reload the project from OpenAPI spec.'
                onClick={() => model.reloadProject(true)}
              >
                <VscRefresh />
              </Button>
            )
        )}
        itemActions={(item, current) => (
          current &&
          <s.ActionButton onClick={() => model.closeProject()} title='Close project' small>
            <VscClose /> <span>Close</span>
          </s.ActionButton>
        )}
      />
    </s.Container>
  );
};
