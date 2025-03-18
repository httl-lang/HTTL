import Button from '../../../../components/button';
import styled, { css } from 'styled-components';

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
  align-items: baseline;
  flex-wrap: ${(props) => props.nowrap ? 'nowrap' : 'wrap'}; 
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
  margin-left: 10px;
  color: var(--vscode-foreground);

  ${(props) => props.short && css`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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



