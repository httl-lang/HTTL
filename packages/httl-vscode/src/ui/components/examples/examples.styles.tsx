import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  overflow: hidden;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

export const Grid = styled.div<{ showFade: boolean }>`
  height: 100%;
  overflow: auto;

  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  max-width: 80%;
  mask-image: ${({ showFade }) => showFade ? 'linear-gradient(to bottom, black, transparent 50%)' : 'none'}; 
`;


export const SectionName = styled.div`
  display: flex;
  gap: 10px; 
  margin: 10px;
  justify-content: center;
  font-weight: 500;
  color: gray;
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
