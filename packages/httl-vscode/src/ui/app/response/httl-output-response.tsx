import { FC, useMemo, useState } from 'react';

import { HttpResponse } from 'httl-core';
import { Viewer } from '../../components/editor';

import * as s from './httl-output-response.styles';
import StatusLabel from '../../components/status-label';
import { VscWarning } from 'react-icons/vsc';
import { Tooltip } from '../../components/tooltip';

export interface HttlOutputResponseProps {
  response: HttpResponse;
  source: string;
  onSourceClick?: () => void;
}

type Panels = 'body' | 'headers';

export const HttlOutputResponse: FC<HttlOutputResponseProps> = ({ response, source, onSourceClick }) => {
  const [panel, setPanel] = useState<Panels>('body');

  // todo: very dirty
  const lang =
    response.res.headers.some(([key, value]) => key.toLowerCase() === 'content-type' && value.includes('xml'))
      ? 'xml'
      : response.res.headers.some(([key, value]) => key.toLowerCase() === 'content-type' && value.includes('html'))
        ? 'html'
        : 'json';

  const { type, name } = useMemo<{ type?: string, name?: string }>(() => {
    const [type, ...rest] = source.split("::");
    if (type === 'quick-run') {
      return {
        type,
        name: 'Quick Run'
      };
    } else if (type === 'project') {
      return {
        type,
        name: rest.pop()
      };
    }

    const sourceFileName = source?.split(/\/|\\/).pop();
    return {
      type: 'file',
      name: sourceFileName
    };

  }, [source]);

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
            <s.SourceLink type={type} title={source} onClick={onSourceClick}>
              {name}
            </s.SourceLink>
          </s.InfoItem>
          <s.Circle />
          <s.InfoItem>
            {response.timings.totalFormatted} ms
          </s.InfoItem>
          <s.Circle />
          <s.InfoItem>
            {response.res.size.totalFormatted}
          </s.InfoItem>
          <s.Circle />
          {
            response.warnings.length > 0 && (
              <>
                <s.InfoItem warning>
                  <Tooltip
                    style={{ marginTop: '2px' }}
                    content={
                      <>
                        {
                          response.warnings.map((warning, index) => (
                            <div key={index}>
                              {warning.message}
                            </div>
                          ))
                        }
                      </>
                    }
                  >
                    <VscWarning />
                  </Tooltip>
                </s.InfoItem>
                <s.Circle />
              </>
            )
          }
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

