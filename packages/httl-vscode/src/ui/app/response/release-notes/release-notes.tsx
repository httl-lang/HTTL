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
            `### **🚀 Updated to [${model.currentVersion}](https://httl.dev/docs/release-notes#VSCODE-0.1.9)**

What's new: 
- 💡[Introducing the **HTTL Project** with **Copilot** Integration!](https://httl.dev/docs/httl-project)
  - **Copilot** automatically generates the OpenAPI specification based on your codebase.
  - **HTTL Project** generates API calls for each endpoint.
  - Get smart, realistic request bodies based on endpoint data schema.

Bugfix:
- Fixed issue with HTTPS requests failing when using a self-signed certificate`
          }
        </Markdown>
      </Suspense>

    </s.ReleaseNotesPopup>
  );
};

export default () => <ReleaseNotesContext><ReleaseNotes /></ReleaseNotesContext>;
