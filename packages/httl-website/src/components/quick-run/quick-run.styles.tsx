import styled from 'styled-components';

export const Container = styled.div`
  padding: 4px;
  background-color: #1e1e1e;
  border-radius: 10px;
  width: 100%;
  position: relative;
`;

export const Loading = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
  border-radius: 10px;

  animation: fade 0.1s linear forwards;

  @keyframes fade {
    0% { opacity: 0; }
    100% { opacity: 0.5; }
  }
`;

export const Editor = styled.div`
  --vscode-editor-background: #313131;
  position: relative;
  padding: 10px;
  border-radius: 10px;
  height: 200px;
  
  background-color: var(--vscode-editor-background);
`;

export const ToolBar = styled.div`
  position: absolute;
  z-index: 10;
  right: 6px;
  top: 6px;
`;

export const Response = styled.div`
  & > div {
    margin-top: 10px;
  }
`;