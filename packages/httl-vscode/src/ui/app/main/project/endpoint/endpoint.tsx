import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { VscJson, VscBracketDot, VscSync } from "react-icons/vsc";

import RunSvg from '/media/run.svg';

import { HttlEditor } from '../../../../components/editor';
import Button from '../../../../components/button';
import { ApiEndpoint } from '../project.model';

import { EndpointContext, useEndpointModel } from './endpoint.model';
import * as s from './endpoint.styles';

const _Endpoint: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchParams] = useSearchParams();
  const highlightedScriptId = searchParams.get("scriptId");
  const random = searchParams.get("scriptId_random");

  const [highlighted, setHighlighted] = useState(false);

  const model = useEndpointModel(({ endpoint, inProgress, expanded, onExpand, height, onResize, setFocus, generateRequest, updateScript, runScript, resetScript, showBodySchema, showResponseSchema }) =>
    ({ endpoint, inProgress, expanded, onExpand, height, onResize, setFocus, generateRequest, updateScript, runScript, resetScript, showBodySchema, showResponseSchema }));

  useEffect(() => {
    if (highlightedScriptId === model.endpoint.id) {
      setHighlighted(true);
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setHighlighted(false), 3000);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setHighlighted(false);
    }

  }, [highlightedScriptId, random]);

  console.log(model.endpoint);

  return (
    <s.Panel ref={ref} expanded={model.expanded} title={model.endpoint.description} highlighted={highlighted}>
      <s.Header onClick={() => model.onExpand()}>
        <s.Name>
          <s.MethodLabelStyled method={model.endpoint.method} /> {model.endpoint.path} <small>{model.endpoint.operationId}</small>
        </s.Name>
        <s.RunButton onClick={() => model.runScript(model.endpoint.id)} progress={model.inProgress}>
          <RunSvg />
        </s.RunButton>
        {
          model.endpoint.scripts.length > 0 &&
          <s.HasScriptIndicator />
        }
      </s.Header>
      {
        model.expanded &&
        <s.Expanded>
          <s.Editor height={model.height} onResize={model.onResize}>
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
              onFocus={() => model.setFocus()}
            />
          </s.Editor>
          <s.ToolBar>
            <Button
              disabled={model.endpoint.scripts.length === 0}
              disableLoading={true}
              onClick={() => model.resetScript(model.endpoint.id)}
              title={model.endpoint.scripts.length === 0 ? "Script is already in initial state" : "Reset script to initial state"}
            >
              <VscSync /> <span>Reset</span>
            </Button>
            <Button
              disabled={!model.endpoint.hasBodySchema}
              disableLoading={true}
              onClick={() => model.showBodySchema(model.endpoint.id)}
              title={model.endpoint.hasBodySchema ? "Show body schema" : "No body schema"}
            >
              <VscJson /> <span>Body</span>
            </Button>
            <Button
              disabled={!model.endpoint.hasResponseSchema}
              disableLoading={true}
              onClick={() => model.showResponseSchema(model.endpoint.id)}
              title={model.endpoint.hasResponseSchema ? "Show response schema" : "No response schema"}
            >
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