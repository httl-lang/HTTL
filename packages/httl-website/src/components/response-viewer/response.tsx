import { FC, useState } from 'react';

import { HttpResponse } from 'httl-core';
import { Viewer } from '../viewer';

import * as s from './response.styles';
import StatusLabel from '../status-label';

export interface HttlOutputResponseProps {
  response: HttpResponse;
}

type Panels = 'body' | 'headers';

export const HttlResponse = ({ response }: HttlOutputResponseProps) => {
  const [panel, setPanel] = useState<Panels>('body');

  // todo: very dirty
  const lang =
    response.res.headers.some(([key, value]) => key.toLowerCase() === 'content-type' && value.includes('xml'))
      ? 'xml'
      : response.res.headers.some(([key, value]) => key.toLowerCase() === 'content-type' && value.includes('html'))
        ? 'html'
        : 'json';

  return (
    <s.ResponseView>
      <s.ActionBar>
        <s.ToggleAction toggled={panel === 'body'} onToggle={() => setPanel('body')}>
          Body
        </s.ToggleAction>
        <s.ToggleAction toggled={panel === 'headers'} onToggle={() => setPanel('headers')}>
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
            <Viewer value={response.res.data} language={lang} options={{
              overviewRulerLanes: 0,
            }} />
          )
        }
        {
          panel === 'headers' && (
            <Viewer value={response.res.headers} language='yaml' options={{
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

