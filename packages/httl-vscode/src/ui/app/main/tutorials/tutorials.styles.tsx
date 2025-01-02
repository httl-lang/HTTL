import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  background-color: var(--vscode-diffEditor-unchangedRegionBackground);
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  padding: 3px 11px;
  color: var(--vscode-badge-background);
  font-variant-caps: all-small-caps;
`;

export const Grid = styled.div`
  height: 0;
  flex: 1;
  overflow-y: auto;
`;

export const Code = styled.code`
  font-size: 12px;
  cursor: pointer;
  padding: 2px 6px;
  white-space: pre-wrap;
  max-height: 4rem;
  overflow: hidden;
  
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

export const Tile = styled.div`
  font-size: 12px;
  cursor: pointer;
  padding: 10px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  &:hover {
      background-color: var(--vscode-input-background);
  }
`;

export const Caption = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--vscode-editor-foreground);
`;

export const Description = styled.div`
  font-size: 12px;
  color: gray;
  margin: 0 0 6px;
`;
