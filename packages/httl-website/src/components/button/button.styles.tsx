import styled from 'styled-components';

export const Button = styled.a`
    display: inline-block;
    cursor: pointer;
    font: normal normal normal 16px / 1 codicon;
    text-align: center;
    text-decoration: none;
    text-rendering: auto;
    text-transform: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    user-select: none;
    
    border-radius: 5px;
    padding: 3px;

    &:hover {
      background-color: var(--vscode-toolbar-hoverBackground);
    }
`;
