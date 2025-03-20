import React from 'react';

import { HttlEditor } from '../../../../components/editor';

import { useProjectModel } from '../project.model';
import * as s from './source.styles';
import { ResizePanel } from '../../../../components/resize-panel';
import { VscCloudDownload } from 'react-icons/vsc';

export const ProjectSource: React.FC = ({ }) => {
  const model = useProjectModel(({ source, sourceType, showOpenApiSpec }) =>
    ({ source, sourceType, showOpenApiSpec }));

  return (
    <s.Container>
      <s.Bar>
        <s.Label>
          Source ({model.sourceType})
        </s.Label>
        <s.SpecButton onClick={() => model.showOpenApiSpec()}>
          <VscCloudDownload />
          <span>OpenApi</span>
        </s.SpecButton>
      </s.Bar>
      <s.Body title={model.source}>
        <span>{model.source}</span>
      </s.Body>
    </s.Container>
  );
};