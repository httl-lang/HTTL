import styled, { css } from 'styled-components';

export const Container = styled.div`
  margin-top: 6px;
`;

export const Editor = styled.div`
`;

export const Label = styled.div`
  font-size: 12px;
  margin: 0 0 3px 1px;
  opacity: 0.6;
  user-select: none;
`;

export const Item = styled.div`
  display: flex;
  align-items: baseline;
`;

export const Name = styled.span`
  color: var(--vscode-quickInputList-focusForeground);
  font-size: 12px;
`;

export const SubTitle = styled.span`
  font-size: 10px;
  margin-left: 10px;
  color: var(--vscode-quickInputList-descriptionForeground);
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

// export const Loader = styled.div`
//   overflow: hidden;
//   padding: 3px 0 3px 6px;
//   text-align: center;
//   color: color-mix(in srgb, var(--vscode-input-foreground) 50%, transparent);
//   border: 1px solid var(--vscode-input-border, transparent);
//   border-radius: 2px;
//   box-sizing: border-box;
//   height: 24px;
//   position: relative;
//   background: linear-gradient(90deg, var(--vscode-input-background) 25%, var(--vscode-input-border) 50%, var(--vscode-input-background) 75%);
//   background-size: 200% 100%;
//   animation: loading 1.5s infinite linear, slide 0.1s ease-in-out;

//   @keyframes loading {
//     0% {
//         background-position: 200% 0;
//     }
//     100% {
//         background-position: -200% 0;
//     }
//   }

//   @keyframes slide {
//       from {
//         height: 0;
//         opacity: 0;
//       }
//       to {
//         height: 24px;
//         opacity: 1;
//       }
//   }
// `;



