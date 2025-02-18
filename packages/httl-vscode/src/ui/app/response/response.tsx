import React from 'react';
import { Outlet } from 'react-router';

import { ResponseContext, useResponseModel } from './response.model';
import * as s from './response.styles';
import News from './news';

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
      <News />
    </s.Container>
  );
};

export const ResponseView = () => <ResponseContext><_ResponseView /></ResponseContext>;