import React from 'react';
import { Outlet } from 'react-router';
import { MainContext } from './main.model';
import * as s from './main.styles';

import { VscBook } from "react-icons/vsc";
import { WelcomeView } from '../../components/welcome';


const _MainView: React.FC = () => {
  return (
    <s.Main>
      <s.Tabs>
        <s.TabButton to="/main/project">
          Project
        </s.TabButton>
        <s.TabButton to="/main/quick-run">
          Run
        </s.TabButton>
        <s.TabButton to="/main/utils">
          Utils
        </s.TabButton>
        <s.TabButton to="/main/tutorials" right icon>
          <VscBook />
        </s.TabButton>
      </s.Tabs>
      <s.Body>
        <Outlet />
        <s.Placeholder>
          <WelcomeView />
        </s.Placeholder>
      </s.Body>
    </s.Main>
  );
};

export const MainView = () => <MainContext><_MainView /></MainContext>;