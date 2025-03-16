import React from 'react';

import { HttlEditor } from '../../../../components/editor';

import { useProjectModel } from '../project.model';
import * as s from './source.styles';
import { ResizePanel } from '../../../../components/resize-panel';

export const ProjectSource: React.FC = ({ }) => {
  const model = useProjectModel(({ source, sourceType }) =>
    ({ source, sourceType }));

  return (
    <s.Container>
      <s.Label>
        Source ({model.sourceType})
      </s.Label>
      <s.Body title={model.source}>
        <span>{model.source}</span>
      </s.Body>
    </s.Container>
  );
};