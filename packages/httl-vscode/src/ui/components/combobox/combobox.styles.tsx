import styled from 'styled-components';
import Popup from '../popup';
import { Loader } from '../loader';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const Main = styled.div`
  overflow: hidden;
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  border: 1px solid var(--vscode-input-border, transparent);
  border-radius: 2px;
  box-sizing: border-box;
  font-size: inherit;
  padding: 0;
  position: relative;
  display: flex;
  flex: 1;
  cursor: pointer;
`;

export const Label = styled.div`
  background-color: inherit;
  height: 24px;
  padding: 3px 3px 3px 6px;
  flex: 1;
`;

export const Input = styled.input`
  background-color: inherit;
  color: var(--vscode-input-foreground);
  height: 24px;
  border-radius: 2px;
  scrollbar-width: none;
  padding: 3px 0 3px 6px;
  outline: none;
  resize: none;
  flex: 1;
`;

export const Buttons = styled.div`
  
`;

export const PopupPanel = styled(Popup)`
  top: -28px;
`;

export const PopupBody = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Select = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 3px;
`;

export const SelectItem = styled.div`
  cursor: pointer;
  border-radius: 3px;
  padding: 3px 6px;
  width: 100%;

  &:hover {
    background-color: var(--vscode-list-hoverBackground);
  }
`;

export const CircleLoader = styled(Loader)`
  position: absolute;
  right: 10px;
  top: 14px;
  opacity: 0.6;
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
