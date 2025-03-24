import React from 'react';
import { VscCloudDownload } from 'react-icons/vsc';

import { useProjectModel } from '../project.model';
import * as s from './source.styles';

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
          <span>Spec</span>
        </s.SpecButton>
      </s.Bar>
      <s.Body title={model.source}>
        <span>{model.source}</span>
      </s.Body>
    </s.Container>
  );
};