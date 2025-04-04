import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { ProjectContext, useProjectModel } from './project.model';
import * as s from './project.styles';
import { ProjectSelector } from './project-selector';
import { Endpoints } from './endpoints';
import { Prestart } from './prestart';
import { ProjectSource } from './source';
import { WelcomeView } from './welcome';

const _ProjectView: React.FC = () => {
  const model = useProjectModel(({ fileInfo, error, reloadProject }) =>
    ({ fileInfo, error, reloadProject }));

  const [searchParams] = useSearchParams();
  const project = searchParams.get("project");
  const random = searchParams.get("project_random");

  useEffect(() => {
    if (model.fileInfo?.path === project) {
      model.reloadProject();
    }
  }, [project, random, model.fileInfo]);

  return (
    <s.Container>
      <ProjectSelector />
      {
        !!model.fileInfo
          ? (
            <>
              <ProjectSource />
              <Prestart />
              <Endpoints />
            </>
          )
          : <WelcomeView />
      }
      {
        model.error !== undefined &&
        <s.ErrorToast>
          {model.error}
        </s.ErrorToast>
      }

    </s.Container >
  );
};

export const ProjectView = () => (
  <ProjectContext>
    <_ProjectView />
  </ProjectContext>
);