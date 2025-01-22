import styled from 'styled-components';
import Button from '../button';

export const Container = styled.div`
  width: 100%;
`;

export const Main = styled.div`
  position: relative;
  padding: 4px;
  background-color: #1e1e1e;
  border-radius: 10px;
`;

export const Loading = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  border-radius: 10px;

  animation: fade 0.1s linear forwards;

  @keyframes fade {
    0% { opacity: 0; }
    100% { opacity: 0.5; }
  }
`;

export const Examples = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 25px;

  & > a {
    opacity: 0.5;
  }
`

export const Editor = styled.div`
  --vscode-editor-background: #313131;
  --vscode-editorStickyScroll-background: #313131;

  position: relative;
  padding: 10px;
  border-radius: 10px;
  height: 200px;
  
  background-color: var(--vscode-editor-background);
`;

export const RunButton = styled(Button)`
  position: absolute;
  z-index: 20;
  right: 6px;
  top: 6px;
  background-color: #313131;
  
  &:hover {
    background-color: #3e3f3f;
  }
`;

export const Response = styled.div`
  & > div {
    margin-top: 10px;
  }
`;