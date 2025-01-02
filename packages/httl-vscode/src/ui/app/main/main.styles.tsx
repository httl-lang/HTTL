import { NavLink } from 'react-router';
import styled from 'styled-components';

export const Main = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const Tabs = styled.div`
  display: flex;
`;

export const Body = styled.div`
  flex: 1;
  height: 0;
`;


export const TabButton = styled(NavLink)`
  display: flex;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    text-rendering: auto;
    text-transform: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    user-select: none;
    border-bottom: 1px solid transparent;
    
    padding: 3px 16px;

    color: var(--vscode-descriptionForeground);
    border-bottom-color: transparent;
    outline: none !important;

    &:hover {
      color: var(--vscode-foreground);
      border-bottom-color: #3d3e40;
    }

    &.active {
      color: #fff;
      border-bottom-width: 1.5px;
      border-bottom-color: var(--vscode-panelTitle-activeBorder);
    }
`;
