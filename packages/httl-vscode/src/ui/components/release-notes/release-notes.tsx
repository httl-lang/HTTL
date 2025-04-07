import React, { FC, Suspense } from 'react';

import { ReleaseNotesContext, useReleaseNotesModel } from './release-notes.model';
import * as s from './release-notes.styles';

const Markdown = React.lazy(() => import('react-markdown'));

const ReleaseNotes: FC = () => {
  const model = useReleaseNotesModel(({ show, currentVersion, aknowledgeReleaseNote }) =>
    ({ show, currentVersion, aknowledgeReleaseNote }));

  return (
    <s.ReleaseNotesPopup
      show={model.show}
      closeOnEscape={false}
      showCloseButton={true}
      onClose={() => model.aknowledgeReleaseNote()}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Markdown>
          {
            `### **🚀 Updated to [${model.currentVersion}](https://httl.dev/docs/release-notes#VSCODE-${model.currentVersion})**

What's new: 
  - **HTTL Project**: Added auto-resizer on double-click for each request panel.

Bugfix:
- Fixed recognition of Python projects.`
          }
        </Markdown>
      </Suspense>

    </s.ReleaseNotesPopup>
  );
};

export default () => <ReleaseNotesContext><ReleaseNotes /></ReleaseNotesContext>;
