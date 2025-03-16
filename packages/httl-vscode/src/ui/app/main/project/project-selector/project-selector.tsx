import React from 'react';
import { VscRefresh, VscSparkle } from "react-icons/vsc";

import ComboBox from '../../../../components/combobox';
import Button from '../../../../components/button';

import { useProjectModel } from '../project.model';
import * as s from './project-selector.styles';


export const ProjectSelector: React.FC = () => {
  const model = useProjectModel(({ fileInfo, supportAgentAnalysis, reloadProject, resolveProjects, selectProject, startAgentAnalysis }) =>
    ({ fileInfo, supportAgentAnalysis, reloadProject, resolveProjects, selectProject, startAgentAnalysis }));

  return (
    <s.Container>
      <ComboBox
        placeholder='Select project'
        keyField='name'
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
            ? <Button onClick={() => model.startAgentAnalysis()}>
              <VscSparkle />
            </Button>
            : <Button onClick={() => model.reloadProject()}>
              <VscRefresh />
            </Button>
        )}
      />
    </s.Container>
  );
};
