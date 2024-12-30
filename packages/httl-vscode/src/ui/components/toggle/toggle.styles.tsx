import styled from 'styled-components';

export const Toggle = styled.a<{ enabled: boolean | number }>`
    display: flex;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    text-rendering: auto;
    text-transform: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    user-select: none;
    
    border-radius: 5px;
    padding: 3px;


    background-color: ${({ enabled }) => enabled ? 'var(--vscode-toolbar-hoverBackground)' : 'none'};

    &:hover {
      background-color: var(--vscode-toolbar-hoverBackground);
        /* background-color: var(--vscode-toolbar-activeBackground); */
    }
`;
