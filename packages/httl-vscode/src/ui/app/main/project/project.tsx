import React from 'react';
import { VscClose } from "react-icons/vsc";

import { HttlEditor, Viewer } from '../../../components/editor';
import Button from '../../../components/button';

import { ProjectContext, useProjectModel } from './project.model';
import * as s from './project.styles';
import RunSvg from './run.svg';
import { VscSparkle } from "react-icons/vsc";
import { ProjectSelector } from './project-selector';
import { EndpointsPanel } from './endpoints-panel';
import { PrestartPanel } from './prestart-panel';

const _ProjectView: React.FC = () => {
  // const model = useProjectModel(({ updateScript }) =>
  //   ({ updateScript }));

  return (
    <s.Container>
      <s.Panel title="HTTL PROJECTS">
        <ProjectSelector />
        <PrestartPanel />
      </s.Panel>
      <EndpointsPanel />
    </s.Container>
  );
};

export const ProjectView = () => <ProjectContext><_ProjectView /></ProjectContext>;