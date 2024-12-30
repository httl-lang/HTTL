import { FC, useState } from 'react';
import { HttpResponse } from 'httl-core';


import * as s from './httl-response-list.styles';
import Popup from '../components/popup';
import { Editor } from '../components/editor';


export interface HttlResponseListItemProps {
  response: HttpResponse;
  showMultipleIndicator?: boolean;
  onClick?: () => void;
}

export const HttlResponseListItem: FC<HttlResponseListItemProps> = ({ response, onClick, showMultipleIndicator }) => {
  const [expanded, setExpanded] = useState(false);
  if (!response) { return null; }

  return (
    <s.ResponseItemContainer>
      <s.ResponseItemHost>
        {showMultipleIndicator && <s.MultipleIndicator />}
        <s.ResponseItem onClick={() => { setExpanded(!expanded); onClick?.(); }}>
          <s.ResMethod method={response.req.method}>{response.req.method}</s.ResMethod>
          <s.ResUrl>{response.req.url}</s.ResUrl>
        </s.ResponseItem>

      </s.ResponseItemHost>
      <Popup show={expanded} onClose={() => setExpanded(false)} style={{ backgroundColor: 'var(--vscode-editor-background)' }}>
        <s.RequestDetails>
          <s.Caption>
            {response.req.method + " " + response.req.url}
          </s.Caption>

          <s.ReqHeader>
            <Editor
              value={response.req.headers}
              language='yaml'
              relayoutAfterValueChange={true}
              options={{
                lineNumbers: 'off',
                overviewRulerLanes: 0,
                folding: false,
                scrollBeyondLastLine: false,
                renderLineHighlight: 'none',
              }} />
          </s.ReqHeader>
          {
            response.req.body && (
              <s.ReqBody>
                <Editor value={response.req.body} relayoutAfterValueChange={true} options={{
                  lineNumbers: 'off',
                  overviewRulerLanes: 0,
                  folding: false,
                  scrollBeyondLastLine: false,
                  renderLineHighlight: 'none',
                }} />
              </s.ReqBody>
            )
          }
        </s.RequestDetails>
      </Popup>
    </s.ResponseItemContainer>
  );
};
