import React from 'react';
import { VscClose, VscRefresh, VscSparkle } from "react-icons/vsc";

import ComboBox from '../../../../components/combobox';
import Button from '../../../../components/button';

import { useProjectModel } from '../project.model';
import * as s from './project-selector.styles';


export const ProjectSelector: React.FC = () => {
  const model = useProjectModel(({ fileInfo, supportAgentAnalysis, reloadProject, resolveProjects, selectProject, closeProject, startAgentAnalysis }) =>
    ({ fileInfo, supportAgentAnalysis, reloadProject, resolveProjects, selectProject, closeProject, startAgentAnalysis }));

  return (
    <s.Container>
      <ComboBox
        placeholder='Select project'
        keyField='id'
        current={model.fileInfo}
        options={(search) => model.resolveProjects(search)}
        onChange={(project) => model.selectProject(project)}
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
            ? <Button onClick={() => model.startAgentAnalysis()} title='Start the project agent analysis. This will analyze the project and find all the endpoints'>
              <VscSparkle />
            </Button>
            : <Button onClick={() => model.reloadProject()} title='Reload the project from OpenAPI spec.'>
              <VscRefresh />
            </Button>
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
