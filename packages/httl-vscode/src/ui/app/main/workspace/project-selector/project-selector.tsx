import React from 'react';
import { VscSparkle } from "react-icons/vsc";

import ComboBox from '../../../../components/combobox';
import Button from '../../../../components/button';

import { useWorkspaceModel } from '../workspace.model';
import * as s from './project-selector.styles';


export const ProjectSelector: React.FC = () => {
  const model = useWorkspaceModel(({ project, resolveProjects, selectProject, inProgress, projectsProgress, startWorkspaceAnalyzing }) =>
    ({ project, resolveProjects, selectProject, inProgress, projectsProgress, startWorkspaceAnalyzing }));

  return (
    <s.Container>
      <ComboBox
        placeholder='Select project'
        keyField='name'
        current={model.project}
        options={(search) => model.resolveProjects(search)}
        onChange={(project) => model.selectProject(project)}
        render={(item) => (
          'path' in item
            ?
            <s.Item>
              <s.Name>
                {item.name}
              </s.Name>
              <s.SubTitle>
                {item.path}
              </s.SubTitle>
            </s.Item>
            :
            <s.Item>
              <s.Name>
                {item.name}
              </s.Name>
              <s.SubTitle>
                {item.specUrl}
              </s.SubTitle>
            </s.Item>
        )}
        buttons={() => (
          <Button progress={model.inProgress} onClick={() => model.startWorkspaceAnalyzing()}>
            <VscSparkle />
          </Button>
        )}
      />
    </s.Container>
  );
};
