import React from 'react';
import { ResponseContext, useResponseModel } from './response.model';

import { Outlet } from 'react-router';

const _ResponseView: React.FC = () => <Outlet />;

export const ResponseView = () => <ResponseContext><_ResponseView /></ResponseContext>;