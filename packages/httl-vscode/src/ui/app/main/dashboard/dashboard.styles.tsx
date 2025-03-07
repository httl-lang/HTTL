import styled, { css } from 'styled-components';

export const Container = styled.div<{ expanded?: boolean }>`
  height: ${p => p.expanded ? '100%' : 'auto'};
  background-color: ${p => p.expanded ? 'var(--vscode-diffEditor-unchangedRegionBackground)' : 'transparent'};
  width: 100%;
  overflow: hidden;
`;

export const Panel = styled.div`
  padding: 5px;
  margin: 6px;
  background-color: var(--vscode-editor-background);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
`;

export const EditPanel = styled.div`
  height: 150px;
`;

export const ViewPanel = styled.div`
  flex: 1;
`;

export const ApisPanel = styled.div`

`

export const Editor = styled.div`
`;

export const Label = styled.div<{ center?: boolean }>`
  font-size: 10px;
  /* color: #535353; */
  margin: 0 10px 0;
  opacity: 0.3;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: ${p => p.center ? 'center' : 'flex-start'};
`;

export const Header = styled.div`
  font-size: 12px;
  line-height: 21px;
  color: #9d9d9d;

  display: flex;
  align-items: center;
  justify-content: space-between;

  small {
    color: #535353;
  }

  a {
    color: #9d9d9d;
  }
`;