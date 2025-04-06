import React, { useRef } from 'react';
import { VscCloudDownload, VscExpandAll, VscCollapseAll, VscSymbolInterface } from "react-icons/vsc";

import { useProjectModel } from '../project.model';
import { Endpoint } from '../endpoint';

import * as s from './endpoints.styles';

export const Endpoints: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  const model = useProjectModel(({ fileInfo, endpointGoups, agentProgress, isExpanded, showOpenApiSpec, toggleExpand }) =>
    ({ fileInfo, endpointGoups, agentProgress, isExpanded, showOpenApiSpec, toggleExpand }));

  const inProgress = model.endpointGoups.some(c => c.inProgress) || model.agentProgress === 'tags';

  return (
    <>
      <s.Bar>
        <s.Label center dark loading={inProgress}>
          Endpoints
        </s.Label>
        {
          !inProgress &&
          <s.ToolBar>
            <s.SpecButton onClick={() => model.showOpenApiSpec()}>
              <VscCloudDownload />
              <span>Spec</span>
            </s.SpecButton>
            <s.EndpointExpander
              title={model.isExpanded ? 'Collapse all' : 'Expand all'}
              toggled={model.isExpanded}
              onToggle={() => model.toggleExpand()}
              onOff={(toggled) => (
                toggled ? <VscCollapseAll /> : <VscExpandAll />
              )}
            />
          </s.ToolBar>
        }
      </s.Bar >

      <s.Container ref={scrollRef} onScroll={() => {
        if (scrollRef.current && shadowRef.current) {
          if (scrollRef.current.scrollTop > 0) {
            shadowRef.current.style.opacity = '1';
          } else {
            shadowRef.current.style.opacity = '0';
          }
        }
      }}>
        <s.ScrollShadow ref={shadowRef} />
        {
          model.endpointGoups.map((group) => (
            <s.EndpointGroup>
              <s.EndpointTag dark={!group.inProgress} loading={group.inProgress}>
                <VscSymbolInterface />  <h1>{group.name}</h1>
              </s.EndpointTag>
              {
                group.endpoints.map((endpoint) => (
                  <Endpoint
                    key={endpoint.id}
                    endpoint={endpoint}
                  />
                ))
              }
            </s.EndpointGroup>
          ))
        }
      </s.Container>
    </>
  );
};
