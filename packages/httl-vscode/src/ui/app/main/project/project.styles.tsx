import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: var(--vscode-diffEditor-unchangedRegionBackground);
  overflow: hidden;
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