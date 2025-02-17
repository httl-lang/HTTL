import { FC, useState } from 'react';

import { HttpResponse } from 'httl-core';
import { Viewer } from '../../components/editor';

import * as s from './httl-output-response.styles';
import StatusLabel from '../../components/status-label';

export interface HttlOutputResponseProps {
  response: HttpResponse;
}

type Panels = 'body' | 'headers';

export const HttlOutputResponse: FC<HttlOutputResponseProps> = ({ response }) => {
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

