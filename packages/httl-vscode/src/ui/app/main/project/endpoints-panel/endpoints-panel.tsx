import React from 'react';
import { VscClose } from "react-icons/vsc";

import { useProjectModel } from '../project.model';
import * as s from './endpoints-panel.styles';
import RunSvg from './run.svg';
import { VscSparkle } from "react-icons/vsc";
import { LoadingText } from '../../../../components/loading-text';
import { HttlEditor } from '../../../../components/editor';
import { MethodLabel } from '../../../../components/method-label';
import { EndpointItem } from './endpoint-item';


export const EndpointsPanel: React.FC = () => {
  const model = useProjectModel(({ endpointGoups, runScript, updateScript }) =>
    ({ endpointGoups, runScript, updateScript }));

  // if (model.controllersProgress) {
  //   return (
  //     <s.Container>
  //       <s.Label center loading>
  //         Endpoints ...
  //       </s.Label>
  //     </s.Container>
  //   );
  // }

  // if (model.controllers.length === 0)
  //   return null;

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
                <EndpointItem
                  key={endpoint.id}
                  endpoint={endpoint}
                  onRun={(code) => model.runScript(endpoint.id, code)}
                  onChange={(code) => model.updateScript(endpoint.id, code)}
                />
              ))
            }
          </s.EndpointGroup>
        ))
      }
    </s.Container>
  );
};


// export const EndpointsPanel: React.FC = () => {
//   const model = useProjectModel(({ controllersProgress, controllers }) =>
//     ({ controllersProgress, controllers }));

//   if (model.controllersProgress) {
//     return (
//       <s.Container>
//         <s.Label center loading>
//           Endpoints ...
//         </s.Label>
//       </s.Container>
//     );
//   }

//   if (model.controllers.length === 0)
//     return null;

//   return (
//     <s.Container>
//       <s.Label center dark loading={model.controllers.some(c => c.inProgress)}>
//         Endpoints
//       </s.Label>

//       {
//         model.controllers.map((controller) => (
//           <>
//             <s.ControllerTag dark={!controller.inProgress} loading={controller.inProgress}>
//               <h1>{controller.tag}</h1> <small>{controller.name}</small>
//             </s.ControllerTag>
//             {
//               Object.entries(controller.spec?.paths || {}).flatMap(([url, methods]) => (
//                 Object.entries(methods as any).map(([method, spec]) => (
//                   <s.Panel>
//                     {method} {url}
//                   </s.Panel>
//                 ))
//               ))
//             }
//           </>
//         ))
//       }
//     </s.Container>
//   );
// };