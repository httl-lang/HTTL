import React from 'react';
import { Outlet } from 'react-router';

import { ResponseContext } from './response.model';
import * as s from './response.styles';
import News from './news';

const _ResponseView: React.FC = () => {
  return (
    <s.Container>
      <Outlet />
      <News />
    </s.Container>
  );
};

export const ResponseView = () => <ResponseContext><_ResponseView /></ResponseContext>;