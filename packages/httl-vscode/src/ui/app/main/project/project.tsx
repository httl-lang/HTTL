import React, { useEffect } from 'react';
import { VscClose } from "react-icons/vsc";

import { HttlEditor, Viewer } from '../../../components/editor';
import Button from '../../../components/button';

import { ProjectContext, useProjectModel } from './project.model';
import * as s from './project.styles';
import RunSvg from './run.svg';
import { VscSparkle } from "react-icons/vsc";
import { ProjectSelector } from './project-selector';
import { Endpoints } from './endpoints';
import { Prestart } from './prestart';
import { useSearchParams } from 'react-router';

const _ProjectView: React.FC = () => {
  const model = useProjectModel(({ fileInfo, reloadPorject }) =>
    ({ fileInfo, reloadPorject }));
  const [searchParams] = useSearchParams();
  const project = searchParams.get("project");
  const rnd = searchParams.get("rnd");

  useEffect(() => {
    if (model.fileInfo?.path === project) {
      model.reloadPorject();
      console.log('reload project');
    }
  }, [project, rnd, model.fileInfo]);

  return (
    <s.Container>
      <s.Panel>
        <ProjectSelector />
        <Prestart />
      </s.Panel>
      <Endpoints />
    </s.Container>
  );
};

export const ProjectView = () => <ProjectContext><_ProjectView /></ProjectContext>;