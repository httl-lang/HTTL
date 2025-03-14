import React from 'react';
import { VscClose } from "react-icons/vsc";

import { useProjectModel } from '../project.model';
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

interface EndpointItemProps {
  endpoint: HttlProjectApiEndpoint;
  onRun?: (code?: string) => void;
  onChange?: (code: string) => void;
}

export const EndpointItem: React.FC<EndpointItemProps> = ({ endpoint, onRun, onChange }) => {
  const [showEditor, setShowEditor] = React.useState(false);

  return (
    <s.Panel expanded={showEditor} title={endpoint.description}>
      <s.Header onClick={() => setShowEditor(!showEditor)}>
        <s.Name>
          <MethodLabel method={endpoint.method} /> {endpoint.path} <small>{endpoint.operationId}</small>
        </s.Name>
        <s.RunButton onClick={() => onRun?.()}>
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
              value={endpoint.scripts.at(0)?.code || `${endpoint.method} ${endpoint.path}`}
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
              onChange={(code) => onChange?.(code)}
              onRun={(code) => onRun?.(code)}
              onFocus={() => null}
            />

          </s.Editor>
          <s.BottomBar>
            <span onClick={() => onChange?.(`${endpoint.method} ${endpoint.path}`)}>
              <VscCode />
            </span>
            <span onClick={() => onChange?.(`{
      "/users/{id}": {
        "get": {
          "summary": "Get user by id",
          "description": "Get user by id",
          "operationId": "getUserById",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "description": "ID of user to return",
              "schema": {
                "type": "integer",
                "format": "int64"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "successful operation",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            },
            "400": {
              "description": "Invalid ID supplied"
            },
            "404": {
              "description": "User not found"
            }
          }
        }
      }
    }`)}>
              <VscJson />
            </span>
            <span onClick={() => setShowEditor(false)}>
              {/* RESPONSE SCHEMA */}
              <VscBracketDot />
            </span>
            {/* <VscIssueReopened /> */}
          </s.BottomBar>
        </s.Expanded>
      }
    </s.Panel>
  );
};
