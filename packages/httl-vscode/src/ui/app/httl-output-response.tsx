import { FC, useState } from 'react';

import { HttpResponse } from 'httl-core';
import { Editor } from '../components/editor';

import * as s from './httl-output-response.styles';
import StatusLabel from '../components/status-label';

export interface HttlOutputResponseProps {
  response: HttpResponse;
}

type Panels = 'body' | 'headers';

export const HttlOutputResponse: FC<HttlOutputResponseProps> = ({ response }) => {
  const [panel, setPanel] = useState<Panels>('body');

  return (
    <s.ResponseView>
      <s.ActionBar>
        <s.ToggleAction toggled={panel === 'body'} onToggle={_ => setPanel('body')}>
          Body
        </s.ToggleAction>
        <s.ToggleAction toggled={panel === 'headers'} onToggle={_ => setPanel('headers')}>
          Headers
        </s.ToggleAction>
        <s.Information>
          <s.InfoItem>
            {response.timings.totalFormatted} ms
          </s.InfoItem>
          <s.Circle />

          <s.InfoItem>
            {response.res.size.totalFormatted}
          </s.InfoItem>
          <s.Circle />

          <s.InfoItem>
            <StatusLabel value={response.statusCode} />
          </s.InfoItem>
        </s.Information>
      </s.ActionBar>

      <s.Response>
        {
          panel === 'body' && (
            <Editor value={response.res.data} options={{
              overviewRulerLanes: 0,
            }} />
          )
        }
        {
          panel === 'headers' && (
            <Editor value={response.res.headers} language='yaml' options={{
              lineNumbers: 'off',
              overviewRulerLanes: 0,
              folding: false,
              scrollBeyondLastLine: false,
            }} />
          )
        }
      </s.Response>
    </s.ResponseView>
  );
};

