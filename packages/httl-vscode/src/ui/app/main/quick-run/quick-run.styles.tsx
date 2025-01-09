import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  user-select: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: var(--vscode-diffEditor-unchangedRegionBackground);
  box-shadow: 0 10px 7px 2px var(--vscode-diffEditor-unchangedRegionBackground);
`;

export const Panel = styled.div`
  padding: 5px 5px 0px 5px;
  margin: 6px;
  background-color: var(--vscode-editor-background);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
`;

export const Editor = styled.div`
`;

export const Description = styled.div`
  font-size: 12px;
  color: #9d9d9d;
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;


export const Note = styled.div`
  font-size: 10px;
  /* color: #535353; */
  margin: 0 10px 0;
  opacity: 0.3;
  user-select: none;
`;

export const Placeholder = styled.div`
  opacity: 0.5;
  position: absolute;
  top: 50%;
  left: 10px;
  right: 10px;
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

