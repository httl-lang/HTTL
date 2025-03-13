import styled, { css } from 'styled-components';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: var(--vscode-diffEditor-unchangedRegionBackground);
  overflow: hidden;
`;

export const Panel = styled.div<{ title?: string }>`
  padding: 5px 5px 0 5px;
  margin: 6px;
  background-color: var(--vscode-editor-background);
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  ${p => p.title && css`
    &::before {
      content: '${p.title}';
      font-size: 12px;
      line-height: 21px;
      color: #9d9d9d;
    }
  `}
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