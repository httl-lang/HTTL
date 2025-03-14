import React, { useCallback } from 'react';
import { VscClose } from "react-icons/vsc";

import { ApiEndpoint, useProjectModel } from '../project.model';
import * as s from './endpoints-panel.styles';
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

interface EndpointItemProps {
  endpoint: ApiEndpoint;
}

export const EndpointItem: React.FC<EndpointItemProps> = ({ endpoint }) => {
  const [showEditor, setShowEditor] = React.useState(false);
  const [editorBusy, setEditorBusy] = React.useState(false);
  const model = useProjectModel(({ generateRequest, updateScript, runScript, resetScript, showBodySchema, showResponseSchema }) =>
    ({ generateRequest, updateScript, runScript, resetScript, showBodySchema, showResponseSchema }));

  const onExpand = useCallback(() => {
    const expand = !showEditor;
    setShowEditor(expand);

    if (expand && !endpoint.scripts.length) {
      setEditorBusy(true);
      model.generateRequest(endpoint.id).then(() => {
        setEditorBusy(false); // Hide loading indicator
      });
    }
  }, [showEditor, endpoint.id, model]);

  console.log(endpoint);

  return (
    <s.Panel expanded={showEditor} title={endpoint.description}>
      <s.Header onClick={onExpand}>
        <s.Name>
          <MethodLabel method={endpoint.method} /> {endpoint.path} <small>{endpoint.operationId}</small>
        </s.Name>
        <s.RunButton onClick={() => model.runScript(endpoint.id)}>
          <RunSvg />
        </s.RunButton>
        {
          endpoint.scripts.length > 0 &&
          <s.HasScriptIndicator />
        }
      </s.Header>
      {
        showEditor &&
        <s.Expanded>
          <s.Editor height="70px">
            <HttlEditor
              value={endpoint.scripts.at(0)?.code ?? endpoint.defaultScript ?? ""}
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
              onChange={(code) => model.updateScript(endpoint.id, code)}
              onRun={(code) => model.runScript(endpoint.id, code)}
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
            <Button onClick={() => model.resetScript(endpoint.id)} title="Reset to initial code">
              <VscSync /> <span>Reset</span>
            </Button>
            <Button onClick={() => model.showBodySchema(endpoint.id)}>
              <VscJson /> <span>Body</span>
            </Button>
            <Button onClick={() => model.showResponseSchema(endpoint.id)}>
              <VscBracketDot /> <span>Response</span>
            </Button>
          </s.ToolBar>
        </s.Expanded>
      }
    </s.Panel>
  );
};
