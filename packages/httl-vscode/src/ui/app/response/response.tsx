import React from 'react';
import { Outlet } from 'react-router';

import { ResponseContext, useResponseModel } from './response.model';
import * as s from './response.styles';

const _ResponseView: React.FC = () => {
  const model = useResponseModel(({ isQuickRunResponse }) => ({ isQuickRunResponse }));

  return (
    <s.Container>
      {
        model.isQuickRunResponse && (
          <s.Badge>Quick Run</s.Badge>
        )
      }
      <Outlet />
    </s.Container>
  );
};

export const ResponseView = () => <ResponseContext><_ResponseView /></ResponseContext>;