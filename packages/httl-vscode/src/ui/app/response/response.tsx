import React from 'react';
import { Outlet } from 'react-router';

import { ResponseContext } from './response.model';
import * as s from './response.styles';
import ReleaseNotes from '../../components/release-notes';
import DebugPanel from '../../components/debug-panel';

const _ResponseView: React.FC = () => {
  return (
    <s.Container>
      <Outlet />
      <ReleaseNotes />
      {
        process.env.NODE_ENV === 'development' && <DebugPanel />
      }
    </s.Container>
  );
};

export const ResponseView = () => <ResponseContext><_ResponseView /></ResponseContext>;