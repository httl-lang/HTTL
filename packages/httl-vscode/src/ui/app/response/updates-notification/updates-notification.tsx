import React, { FC, Suspense } from 'react';

import { UpdatesNotificationContext, useUpdatesNotificationModel } from './updates-notification.model';
import * as s from './updates-notification.styles';

const Markdown = React.lazy(() => import('react-markdown'));

const UpdatesNotification: FC = () => {
  const model = useUpdatesNotificationModel(({ show, currentVersion, aknowledgeReleaseNote }) =>
    ({ show, currentVersion, aknowledgeReleaseNote }));

  return (
    <s.UpdatesNotificationPopup
      show={model.show}
      closeOnEscape={false}
      showCloseButton={true}
      onClose={() => model.aknowledgeReleaseNote()}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Markdown>
          {
            `### **🚀 Updated to ${model.currentVersion}**

What's new: 
- 💡[Introducing the New HTTL Project - Now with **Copilot** Integration!](https://httl.dev/docs/release-notes#VSCODE-0.1.9)
  - Let **Copilot** automatically generate API requests from your codebase.
  - Import API requests from your existing OpenAPI specs.
  - Get smart, realistic request bodies based on your data models.

Bugfix:
- Fixed issue with HTTPS requests failing when using a self-signed certificate`
          }
        </Markdown>
      </Suspense>

    </s.UpdatesNotificationPopup>
  );
};

export default () => <UpdatesNotificationContext><UpdatesNotification /></UpdatesNotificationContext>;
