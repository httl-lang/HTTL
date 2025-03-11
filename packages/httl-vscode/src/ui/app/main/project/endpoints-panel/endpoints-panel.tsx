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
  const model = useProjectModel(({ endpointGoups, runScript }) =>
    ({ endpointGoups, runScript }));

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
  console.log('endpointGoups__', model.endpointGoups);
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
          <>
            <s.ControllerTag dark={!group.inProgress} loading={group.inProgress}>
              <h1>{group.name}</h1> {/*<small>{controller.name}</small> */}
            </s.ControllerTag>
            {
              group.endpoints.map((endpoint) => (
                <EndpointItem endpoint={endpoint} onRun={(script) => model.runScript(script)} />
              ))
            }
          </>
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