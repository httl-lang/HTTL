import { ResizePanel } from '../../../../components/resize-panel';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Body = styled.div`
  overflow: hidden;
  color: var(--vscode-input-foreground);
  border-radius: 5px;
  box-sizing: border-box;
  display: flex;
  flex: 1;
  background-color: var(--vscode-editor-background);
  padding: 5px 5px 5px 7px;
  font-size: 11px;

  & span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Label = styled.div`
  font-size: 12px;
  margin: 0 0 3px 1px;
  opacity: 0.6;
  user-select: none;
`;