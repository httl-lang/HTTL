import React from 'react';
import { VscClose } from "react-icons/vsc";

import { useWorkspaceModel } from '../project.model';
import * as s from './endpoints-panel.styles';
import RunSvg from './run.svg';
import { VscSparkle } from "react-icons/vsc";
import { LoadingText } from '../../../../components/loading-text';


export const EndpointsPanel: React.FC = () => {
  const model = useWorkspaceModel(({ controllersProgress, controllers }) =>
    ({ controllersProgress, controllers }));

  if (model.controllersProgress) {
    return (
      <s.Container>
        <s.Label center loading>
          Endpoints ...
        </s.Label>
      </s.Container>
    );
  }

  if (model.controllers.length === 0)
    return null;

  return (
    <s.Container>
      <s.Label center dark loading={model.controllers.some(c => c.inProgress)}>
        Endpoints
      </s.Label>

      {
        model.controllers.map((controller) => (
          <>
            <s.ControllerTag dark={!controller.inProgress} loading={controller.inProgress}>
              <h1>{controller.tag}</h1> <small>{controller.name}</small>
            </s.ControllerTag>
            {
              Object.entries(controller.spec?.paths || {}).flatMap(([url, methods]) => (
                Object.entries(methods as any).map(([method, spec]) => (
                  <s.Panel>
                    {method} {url}
                  </s.Panel>
                ))
              ))
            }
          </>
        ))
      }
    </s.Container>
  );
};