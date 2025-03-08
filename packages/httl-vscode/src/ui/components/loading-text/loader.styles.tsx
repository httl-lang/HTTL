import styled, { css } from 'styled-components';

export const Container = styled.div<{ loading?: boolean }>`
    color: var(--vscode-input-foreground);

    ${p => p.loading && css`
      background: linear-gradient(to right, 
        var(--vscode-input-foreground) 0, 
        color-mix(in srgb, var(--vscode-input-foreground) 30%, transparent) 38%, 
        var(--vscode-input-foreground) 90%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shine 1.5s infinite linear; 

      background-size: 200%;
    `}

    @keyframes shine {
      0% {
        background-position: 0%;
      }

      100% {
          background-position: -200%;
      }
    } 
`;
