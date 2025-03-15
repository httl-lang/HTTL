import React from 'react';
import { VscClose } from "react-icons/vsc";

import { useProjectModel } from '../project.model';
import * as s from './endpoints.styles';
import RunSvg from './run.svg';
import { VscSparkle } from "react-icons/vsc";
import { LoadingText } from '../../../../components/loading-text';
import { HttlEditor } from '../../../../components/editor';
import { MethodLabel } from '../../../../components/method-label';
import { Endpoint } from '../endpoint';

export const Endpoints: React.FC = () => {
  const model = useProjectModel(({ endpointGoups }) =>
    ({ endpointGoups }));

  return (
    <s.Container>
      {/* <s.Label center dark loading={model.controllers.some(c => c.inProgress)}>
        Endpoints
      </s.Label> */}

      <s.Label center dark>
        Endpoints
      </s.Label>

      {
        model.endpointGoups.map((group) => (
          <s.EndpointGroup>
            <s.EndpointTag dark={!group.inProgress} loading={group.inProgress}>
              <h1>{group.name}</h1> {/*<small>{controller.name}</small> */}
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
