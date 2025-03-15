import React, { useCallback } from 'react';
import { VscClose } from "react-icons/vsc";

import { ApiEndpoint, useProjectModel } from '../project.model';
import * as s from './endpoint.styles';
import RunSvg from '/media/run.svg';
import { VscCircleFilled } from "react-icons/vsc";
import { LoadingText } from '../../../../components/loading-text';
import { HttlEditor } from '../../../../components/editor';
import { MethodLabel } from '../../../../components/method-label';
import { HttlProjectApiEndpoint } from '../../../../../client/services/project';
import Button from '../../../../components/button';
import { VscIssueReopened } from "react-icons/vsc";
import { VscCode } from "react-icons/vsc";
import { VscJson } from "react-icons/vsc";
import { VscBracketDot } from "react-icons/vsc";
import { VscSync } from "react-icons/vsc";
import { EndpointContext, useEndpointModel } from './endpoint.model';

const _Endpoint: React.FC = () => {
  const [showEditor, setShowEditor] = React.useState(false);
  const [editorBusy, setEditorBusy] = React.useState(false);

  const model = useEndpointModel(({ endpoint, generateRequest, updateScript, runScript, resetScript, showBodySchema, showResponseSchema }) =>
    ({ endpoint, generateRequest, updateScript, runScript, resetScript, showBodySchema, showResponseSchema }));

  const onExpand = useCallback(() => {
    const expand = !showEditor;
    setShowEditor(expand);

    if (expand && !model.endpoint.scripts.length) {
      setEditorBusy(true);
      model.generateRequest(model.endpoint.id).then(() => {
        setEditorBusy(false); // Hide loading indicator
      });
    }
  }, [showEditor, model.endpoint.id, model]);

  console.log(model.endpoint);

  return (
    <s.Panel expanded={showEditor} title={model.endpoint.description}>
      <s.Header onClick={onExpand}>
        <s.Name>
          <MethodLabel method={model.endpoint.method} /> {model.endpoint.path} <small>{model.endpoint.operationId}</small>
        </s.Name>
        <s.RunButton onClick={() => model.runScript(model.endpoint.id)}>
          <RunSvg />
        </s.RunButton>
        {
          model.endpoint.scripts.length > 0 &&
          <s.HasScriptIndicator />
        }
      </s.Header>
      {
        showEditor &&
        <s.Expanded>
          <s.Editor height="70px">
            <HttlEditor
              value={model.endpoint.scripts.at(0)?.code ?? model.endpoint.defaultScript ?? ""}
              options={{
                overviewRulerLanes: 0,
                lineNumbers: 'off',
                lineDecorationsWidth: 0,
                glyphMargin: false,
                folding: false,
                scrollBeyondLastLine: false,
                renderLineHighlight: "none",
                scrollbar: {
                  alwaysConsumeMouseWheel: false,
                },
              }}
              onChange={(code) => model.updateScript(model.endpoint.id, code)}
              onRun={(code) => model.runScript(model.endpoint.id, code)}
              onFocus={() => null}
            />
            {/* <s.FloatingBar>
              {
                endpoint.scripts.length > 0 &&
                <Button onClick={() => onChange?.()} title="Reset to initial code">
                  <VscSync />
                </Button>
              }
            </s.FloatingBar> */}
          </s.Editor>
          <s.ToolBar>
            <Button onClick={() => model.resetScript(model.endpoint.id)} title="Reset to initial code">
              <VscSync /> <span>Reset</span>
            </Button>
            <Button onClick={() => model.showBodySchema(model.endpoint.id)}>
              <VscJson /> <span>Body</span>
            </Button>
            <Button onClick={() => model.showResponseSchema(model.endpoint.id)}>
              <VscBracketDot /> <span>Response</span>
            </Button>
          </s.ToolBar>
        </s.Expanded>
      }
    </s.Panel>
  );
};

export const Endpoint = ({ endpoint }: { endpoint: ApiEndpoint }) => (
  <EndpointContext {...endpoint}>
    <_Endpoint />
  </EndpointContext>
);