import styled, { css } from 'styled-components';


export const Container = styled.div`

`;

export const Panel = styled.div`

`;

export const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Handler = styled.div`
  background-color: var(--vscode-input-background);
  width: 10%;
  height: 3px;
  border-radius: 3px;
`;

export const Resizer = styled.div`
  cursor: ns-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 10px;
  
  &:hover {
    ${Handler} {
      background-color: var(--vscode-input-border);
    }
  }
`;