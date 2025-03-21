import React from 'react';
import { VscSymbolInterface } from "react-icons/vsc";

import { useProjectModel } from '../project.model';
import { Endpoint } from '../endpoint';

import * as s from './endpoints.styles';

export const Endpoints: React.FC = () => {
  const model = useProjectModel(({ endpointGoups, agentProgress }) =>
    ({ endpointGoups, agentProgress }));

  return (
    <s.Container>
      <s.Label center dark loading={model.endpointGoups.some(c => c.inProgress) || model.agentProgress === 'tags'}>
        Endpoints
      </s.Label>

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
  );
};
