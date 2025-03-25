import React, { FC, Suspense } from 'react';

import { DebugPanelContext, useDebugPanelModel } from './debug-panel.model';
import * as s from './debug-panel.styles';
import Button from '../button';
import { VscTrash } from 'react-icons/vsc';

const DebugPanel: FC = () => {
  const model = useDebugPanelModel(({ clearAppState }) =>
    ({ clearAppState }));

  return (
    <s.Container
      show={true}
      closeOnEscape={false}
      showCloseButton={true}
    // onClose={() => model.aknowledgeReleaseNote()}
    >
      <Button onClick={() => model.clearAppState()}>
        <VscTrash />
      </Button>

    </s.Container>
  );
};

export default () => <DebugPanelContext><DebugPanel /></DebugPanelContext>;
