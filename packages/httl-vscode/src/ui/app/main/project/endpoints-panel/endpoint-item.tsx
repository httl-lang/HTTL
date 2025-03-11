import React from 'react';
import { VscClose } from "react-icons/vsc";

import { useProjectModel } from '../project.model';
import * as s from './endpoints-panel.styles';
import RunSvg from './run.svg';
import { VscSparkle } from "react-icons/vsc";
import { LoadingText } from '../../../../components/loading-text';
import { HttlEditor } from '../../../../components/editor';
import { MethodLabel } from '../../../../components/method-label';
import { HttlProjectApiEndpoint } from '../../../../../client/services/project';

interface EndpointItemProps {
  endpoint: HttlProjectApiEndpoint;
  onRun?: (script: string) => void;
}

export const EndpointItem: React.FC<EndpointItemProps> = ({ endpoint, onRun }) => {
  const [showEditor, setShowEditor] = React.useState(false);

  return (
    <s.Panel expanded={showEditor}>
      <s.Endpoint onClick={() => setShowEditor(!showEditor)} expanded={showEditor}>
        <MethodLabel method={endpoint.method} /> {endpoint.path}
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
            onChange={(script) => null}
            onRun={(script) => onRun?.(script)}
            onFocus={() => null}
          />
        </s.EndpointEditor>
      }
    </s.Panel>
  );
};
