import styled from 'styled-components';

export const ErrorView = styled.div`
  width: 100%;
  display: flex;
  
  flex-direction: column;
`;

export const Errors = styled.div`
  display: flex;
  flex-direction: column;
  padding: 7px;
  gap: 10px;
  flex: 1;
`;

export const Error = styled.div<{ active?: number }>`
    border-color: ${({ active }) => active ? 'var(--vscode-focusBorder) !important' : 'transparent'};

    display: flex;
    align-items: center;
    gap: 5px;

    cursor: pointer;
    background-color: #5d2222;
    border: 1px solid #9a1b1b;
    border-radius: 4px;
    box-sizing: border-box;
    
    padding: 2px 6px;
    flex: 1;

    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;

    &:hover {
        border-color: var(--vscode-commandCenter-activeBorder);
    }
`;