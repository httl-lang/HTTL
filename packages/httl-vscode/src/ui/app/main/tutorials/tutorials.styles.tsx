import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  overflow: auto;
`;

export const Grid = styled.div`
  height: 100%;
  display: flex;
  gap: 15px;
  flex-direction: column;
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
  padding: 2px 6px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: 1px solid transparent;  
  border-radius: 4px;

  &:hover {
      background-color: var(--vscode-input-background);
      border-color: var(--vscode-commandCenter-activeBorder);
  }
`;

export const Caption = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

export const Description = styled.div`
  font-size: 12px;
  color: gray;
  margin: 0 0 6px;
`;
