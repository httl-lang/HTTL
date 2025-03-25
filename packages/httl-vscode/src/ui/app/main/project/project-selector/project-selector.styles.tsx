import styled, { css } from 'styled-components';

import Button from '../../../../components/button';


export const Container = styled.div`
  margin: 6px;
  margin-top: 10px;
`;

export const Editor = styled.div`
`;

export const Label = styled.div`
  font-size: 12px;
  margin: 0 0 3px 1px;
  opacity: 0.6;
  user-select: none;
`;

export const Item = styled.div<{ nowrap?: boolean }>`
  display: flex;
  flex-direction: ${(props) => props.nowrap ? 'row' : 'column'};
  align-items: baseline;
  flex-wrap: ${(props) => props.nowrap ? 'nowrap' : 'wrap'}; 
`;

export const NoItems = styled.div`
  cursor: default;
  
  & a {
    font-weight: var(--vscode-font-weight);
    font-family: var(--vscode-font-family);

    &:hover {
      text-decoration: underline;
      background-color: transparent;
    }
  }
`;

export const ActionButton = styled(Button)`
  font-weight: var(--vscode-font-weight);
  font-family: var(--vscode-font-family);

  display: flex;
  font-size: 10px;
  gap: 3px;
  font-variant-caps: all-petite-caps;
  padding: 3px 5px;
  border-radius: 3px;

  & span {
    margin-top: -1px;
    pointer-events: none;
  }
`;

export const Name = styled.span`
  font-size: 12px;
  color: var(--vscode-quickInputList-focusForeground);
  white-space: nowrap;
`;

export const SubTitle = styled.span<{ short?: boolean }>`
  font-size: 10px;
  padding-left: 10px;
  color: var(--vscode-foreground);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;

  ${(props) => props.short && css`
    width: auto;
  `}
`;



export const DefaultHttlFile = styled.div`
  margin-top: 10px;
  animation: slide 0.2s ease-in-out;

  @keyframes slide {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
  }
`;
