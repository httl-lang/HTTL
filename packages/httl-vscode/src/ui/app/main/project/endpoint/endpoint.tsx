import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { VscJson, VscBracketDot, VscSync, VscSparkleFilled } from "react-icons/vsc";

import RunSvg from '/media/run.svg';

import { HttlEditor, HttlEditorRef } from '../../../../components/editor';
import Button from '../../../../components/button';
import { ApiEndpoint } from '../project.model';

import { EndpointContext, useEndpointModel } from './endpoint.model';
import * as s from './endpoint.styles';

const _Endpoint: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HttlEditorRef>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchParams] = useSearchParams();
  const highlightedScriptId = searchParams.get("scriptId");
  const random = searchParams.get("scriptId_random");

  const [highlighted, setHighlighted] = useState(false);

  const model = useEndpointModel(({ endpoint, inProgress, expanded, focused, toggleExpand, height, setHeight, onFocus, generateRequest, updateScript, runScript, resetScript, showBodySchema, showResponseSchema, generateAiRequest, stopGeneratingAiRequest }) =>
    ({ endpoint, inProgress, expanded, focused, toggleExpand, height, setHeight, onFocus, generateRequest, updateScript, runScript, resetScript, showBodySchema, showResponseSchema, generateAiRequest, stopGeneratingAiRequest }));

  useEffect(() => {
    if (highlightedScriptId === model.endpoint.endpointId) {
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
    <s.Panel
      ref={ref}
      expanded={model.expanded}
      title={model.endpoint.description}
      highlighted={highlighted || model.focused}
      onClickCapture={model.onFocus}
    >
      <s.Header onClick={() => model.toggleExpand()}>
        <s.Name>
          <s.MethodLabelStyled method={model.endpoint.method} /> {model.endpoint.path} <small>{model.endpoint.operationId}</small>
        </s.Name>
        <s.RunButton onClick={() => model.runScript(model.endpoint.endpointId)} progress={model.inProgress}>
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
          <s.Editor
            height={model.height}
            onResize={model.setHeight}
            onResizeDoubleClick={() => editorRef.current && model.setHeight(editorRef.current.getHeight())}
            title='Double-click to auto-resize this panel'
          >
            <HttlEditor
              ref={editorRef}
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
              onChange={(code) => model.updateScript(model.endpoint.endpointId, code)}
              onRun={(code) => model.runScript(model.endpoint.endpointId, code)}
            // onFocus={model.onFocus}
            />
          </s.Editor>
          <s.ToolBar>
            <Button
              disabled={model.endpoint.scripts.length === 0}
              disableLoading={true}
              onClick={() => model.resetScript(model.endpoint.endpointId)}
              title={model.endpoint.scripts.length === 0 ? "Script is already in initial state" : "Reset script to initial state"}
            >
              <VscSync /> <span>Reset</span>
            </Button>
            <Button
              disabled={!model.endpoint.hasBodySchema}
              disableLoading={true}
              onClick={() => model.showBodySchema(model.endpoint.endpointId)}
              title={model.endpoint.hasBodySchema ? "Show body schema" : "Request does not have a body schema"}
            >
              <VscJson /> <span>Body</span>
            </Button>
            <Button
              disabled={!model.endpoint.hasResponseSchema}
              disableLoading={true}
              onClick={() => model.showResponseSchema(model.endpoint.endpointId)}
              title={model.endpoint.hasResponseSchema ? "Show response schema" : "Request does not have a response schema"}
            >
              <VscBracketDot /> <span>Response</span>
            </Button>

            <s.MagicButton
              disabled={!model.endpoint.hasBodySchema}
              allowStop
              small
              onClick={(stop) => stop
                ? model.stopGeneratingAiRequest()
                : model.generateAiRequest(model.endpoint.endpointId)
              }
              title={model.endpoint.hasBodySchema ? "Generate a request body using Copilot" : "Request does not have a body schema"}
            >
              <VscSparkleFilled />
            </s.MagicButton>
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