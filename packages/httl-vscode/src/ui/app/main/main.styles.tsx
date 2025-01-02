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
  gap: 15px;
  padding: 0 8px;
`;

export const Body = styled.div`
  flex: 1;
  height: 0;
`;


export const TabButton = styled(NavLink) <{ right?: boolean, icon?: boolean }>`
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
  text-transform: uppercase; 
  
  font-size: ${(props) => props.icon ? '16px' : '11px'};
  padding: 0 4px 3px;
  margin-left: ${(props) => props.right ? 'auto' : '0'};

  color: var(--vscode-descriptionForeground);
  border-bottom-color: transparent;
  outline: none !important;

  &:hover {
    color: var(--vscode-foreground);
    border-bottom-color: #3d3e40;
  }

  &.active {
    color: #fff;
    border-bottom-width: 1px;
    border-bottom-color: var(--vscode-panelTitle-activeBorder);
  }
`;

export const Placeholder = styled.div`
  z-index: -1;
  opacity: 0.3;
  position: absolute;
  top: 50%;
  left: 10px;
  right: 10px;
`;