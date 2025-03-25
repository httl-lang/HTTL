import React from 'react';
import { Outlet } from 'react-router';

import { ResponseContext } from './response.model';
import * as s from './response.styles';
import UpdatesNotification from './updates-notification';
import DebugPanel from '../../components/debug-panel';

const _ResponseView: React.FC = () => {
  return (
    <s.Container>
      <Outlet />
      <UpdatesNotification />
      {
        process.env.NODE_ENV === 'development' && <DebugPanel />
      }
    </s.Container>
  );
};

export const ResponseView = () => <ResponseContext><_ResponseView /></ResponseContext>;