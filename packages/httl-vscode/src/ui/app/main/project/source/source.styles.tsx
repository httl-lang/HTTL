import styled from 'styled-components';
import Button from '../../../../components/button';

export const Container = styled.div`
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  margin: 6px;
`;

export const Body = styled.div`
  overflow: hidden;
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

export const Bar = styled.div`
  display: flex;
  margin: 0 0 3px 1px;
  justify-content: space-between;
`;

export const Label = styled.div`
  font-size: 13px;
  opacity: 0.6;
  user-select: none;
  font-variant-caps: all-petite-caps;
`;