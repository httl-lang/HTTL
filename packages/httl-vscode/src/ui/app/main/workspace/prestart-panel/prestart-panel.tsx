import React from 'react';
import { VscClose } from "react-icons/vsc";

import { HttlEditor, Viewer } from '../../../../components/editor';

import { useWorkspaceModel } from '../project.model';
import * as s from './prestart-panel.styles';
import RunSvg from './run.svg';
import { VscSparkle } from "react-icons/vsc";
import ComboBox from '../../../../components/combobox';
import Button from '../../../../components/button';


export const PrestartPanel: React.FC = () => {
  const model = useWorkspaceModel(({ project, resolveProjects, selectProject, inProgress, projectsProgress, startWorkspaceAnalyzing }) =>
    ({ project, resolveProjects, selectProject, inProgress, projectsProgress, startWorkspaceAnalyzing }));

  return (
    <s.Container>
      <s.Label>
        Prestart
      </s.Label>
      <s.Editor style={{ height: 150 }}>
        <HttlEditor
          value={project.sss}
          options={{
            overviewRulerLanes: 0,
            lineNumbers: 'off',
            lineDecorationsWidth: 0,
            glyphMargin: false,
            folding: false,
            scrollBeyondLastLine: false,
          }}
          onChange={(script) => null}
          onRun={(script) => null}
          onFocus={() => null}
        />
      </s.Editor>
    </s.Container>
  );
};

// export const ProjectPanel: React.FC = () => {
//   const model = useWorkspaceModel(({ projects, projectsProgress, }) =>
//     ({ projects, projectsProgress }));

//   if (model.projectsProgress) {
//     return (
//       <s.Container>
//         <s.Loader> Loading... </s.Loader>
//       </s.Container>
//     );
//   }

//   if (model.projects.length === 0)
//     return null;

//   return (
//     <s.Container>
//       <ComboBox
//         options={model.projects}
//         value={model.projects[0]}
//         render={(item) => (
//           <s.ProjectTitle>
//             <s.ProjectName>
//               {item.name}
//             </s.ProjectName>
//             <s.ProjectStack>
//               {item.technology}
//             </s.ProjectStack>
//           </s.ProjectTitle>
//         )}
//       />
//       <s.DefaultHttlFile >
//         <s.Label>
//           Default <a href='https://httl.dev/docs/guide/module#default-httl-file'>.httl</a> file
//         </s.Label>
//         <s.Editor style={{ height: 150 }}>
//           <HttlEditor
//             value={"@spec: :3000"}
//             options={{
//               overviewRulerLanes: 0,
//               lineNumbers: 'off',
//               lineDecorationsWidth: 0,
//               glyphMargin: false,
//               folding: false,
//               scrollBeyondLastLine: false,
//             }}
//             onChange={(script) => null}
//             onRun={(script) => null}
//             onFocus={() => null}
//           />
//         </s.Editor>
//       </s.DefaultHttlFile>
//     </s.Container>
//   );
// };
