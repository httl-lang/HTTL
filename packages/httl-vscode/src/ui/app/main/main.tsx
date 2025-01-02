import React from 'react';
import { Outlet, NavLink } from 'react-router';
import { MainContext, useMainModel } from './main.model';
import * as s from './main.styles';
import { BiExpandVertical } from 'react-icons/bi';
import { VscCode } from "react-icons/vsc";
import { VscTarget } from "react-icons/vsc";
import { VscJson } from "react-icons/vsc";


const _MainView: React.FC = () => {
  return (
    <s.Main>
      <s.Tabs>
        <s.TabButton to="/main" end>
          {/* <VscCode />  */}
          Run
          {/* quick panel */}
        </s.TabButton>
        <s.TabButton to="/main/utils" end>
          Utils
          {/* <VscTarget /> */}
          {/* local port scanning */}
        </s.TabButton>
        <s.TabButton to="/main/tutorials" end>
          Tutorials
          {/* <VscJson /> */}
          {/* local port scanning */}
        </s.TabButton>
      </s.Tabs>
      <s.Body>
        <Outlet />
      </s.Body>
    </s.Main>
  );
};

export const MainView = () => <MainContext><_MainView /></MainContext>;