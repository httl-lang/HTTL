import { NavLink } from 'react-router';
import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const Panel = styled.div`
  padding: 5px;
  margin: 6px;
  background-color: var(--vscode-editor-background);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
`;

export const Editor = styled.div`
  height: 100px;
`;

export const Description = styled.div`
  font-size: 12px;
  color: #9d9d9d;
  margin: 0 0 6px;
`;

export const Placeholder = styled.div`
  opacity: 0.5;
  position: absolute;
  top: 50%;
  left: 10px;
  right: 10px;
`;