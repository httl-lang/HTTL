import styled, { css } from 'styled-components';

export const Button = styled.a<{ disabled?: boolean, small?: boolean }>`
    cursor: pointer;
    font: ${({ small }) => small
      ? 'normal normal normal 12px / 1 codicon' 
      : 'normal normal normal 16px / 1 codicon'
    };
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

    ${({ disabled }) => disabled && css`
      cursor: not-allowed;
      filter: brightness(0.5);

      &:hover {
        background-color: transparent;
      }
    `}
`;