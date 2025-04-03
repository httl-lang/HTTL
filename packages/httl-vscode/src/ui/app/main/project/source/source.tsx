import React from 'react';

import { useProjectModel } from '../project.model';
import * as s from './source.styles';

export const ProjectSource: React.FC = ({ }) => {
  const model = useProjectModel(({ source, sourceType }) =>
    ({ source, sourceType }));

  return (
    <s.Container>
      <s.Bar>
        <s.Label>
          Source ({model.sourceType})
        </s.Label>
      </s.Bar>
      <s.Body title={model.source}>
        <span>{model.source}</span>
      </s.Body>
    </s.Container>
  );
};