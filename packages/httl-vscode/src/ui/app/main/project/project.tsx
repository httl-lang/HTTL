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
  const model = useProjectModel(({ fileInfo, agentProgress, reloadProject }) =>
    ({ fileInfo, agentProgress, reloadProject }));

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
          ? <>
            <ProjectSource />
            <Prestart />
            <Endpoints />
          </>
          : <WelcomeView />
      }
      {
        model.agentProgress === 'error' &&
        <s.ErrorToast>
          Oops! Something went wrong. Please try running the analysis again.
        </s.ErrorToast>
      }

    </s.Container >
  );
};

export const ProjectView = () => <ProjectContext><_ProjectView /></ProjectContext>;