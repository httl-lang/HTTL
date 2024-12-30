import styled from 'styled-components';

export const HttlOutputView = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--vscode-editor-background);
`;

export const Loader = styled.div`
  
`;

export const Main = styled.div`
  flex: 1;
  height: 100%;
  width: 100%;
  display: flex;
`;

export const ResponseList = styled.div`
`;

export const ResponseItem = styled.div<{ active: number }>`
    background-color: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border, transparent);
    border-radius: 4px;
    box-sizing: border-box;
    cursor: text;
    max-width: 100%;
    padding: 0 6px 6px;
`;

export const Errors = styled.div`
`;

export const Error = styled.div`
`;

export const EmptyScript = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  font-weight: 500;
`;