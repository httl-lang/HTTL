import React from 'react';
import { VscSparkle } from "react-icons/vsc";

import ComboBox from '../../../../components/combobox';
import Button from '../../../../components/button';

import { useProjectModel } from '../project.model';
import * as s from './project-selector.styles';


export const ProjectSelector: React.FC = () => {
  const model = useProjectModel(({ fileInfo, resolveProjects, selectProject }) =>
    ({ fileInfo, resolveProjects, selectProject }));

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
      // buttons={() => (
      //   <Button progress={model.inProgress} onClick={() => model.startWorkspaceAnalyzing()}>
      //     <VscSparkle />
      //   </Button>
      // )}
      />
    </s.Container>
  );
};
