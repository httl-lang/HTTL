import React from 'react';
import { VscClose } from "react-icons/vsc";

import { useProjectModel } from '../project.model';
import * as s from './endpoints-panel.styles';
import RunSvg from '/media/run.svg';
import { VscSparkle } from "react-icons/vsc";
import { LoadingText } from '../../../../components/loading-text';
import { HttlEditor } from '../../../../components/editor';
import { MethodLabel } from '../../../../components/method-label';
import { HttlProjectApiEndpoint } from '../../../../../client/services/project';
import Button from '../../../../components/button';

interface EndpointItemProps {
  endpoint: HttlProjectApiEndpoint;
  onRun?: (code?: string) => void;
  onChange?: (code: string) => void;
}

export const EndpointItem: React.FC<EndpointItemProps> = ({ endpoint, onRun, onChange }) => {
  const [showEditor, setShowEditor] = React.useState(false);

  return (
    <s.Panel expanded={showEditor}>
      <s.Endpoint onClick={() => setShowEditor(!showEditor)}>
        <s.EndpointTitle expanded={showEditor}>
          <MethodLabel method={endpoint.method} /> {endpoint.path}
        </s.EndpointTitle>
        <Button onClick={() => onRun?.()}>
          <RunSvg />
        </Button>
      </s.Endpoint>
      {
        showEditor &&
        <s.EndpointEditor>
          <HttlEditor
            value={endpoint.scripts.at(0)?.code || `${endpoint.method} ${endpoint.path}`}
            options={{
              overviewRulerLanes: 0,
              lineNumbers: 'off',
              lineDecorationsWidth: 0,
              glyphMargin: false,
              folding: false,
              scrollBeyondLastLine: false,
              renderLineHighlight: "none",
            }}
            onChange={(code) => onChange?.(code)}
            onRun={(code) => onRun?.(code)}
            onFocus={() => null}
          />
        </s.EndpointEditor>
      }
    </s.Panel>
  );
};
