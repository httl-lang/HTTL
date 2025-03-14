import { ResizePanel } from '../../../../components/resize-panel';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Editor = styled(ResizePanel)`
  --background: var(--vscode-editor-background);

  padding: 5px 5px 0 5px;
  border-radius: 5px;
  background-color: var(--background);

  .monaco-editor {
    --vscode-editor-background: var(--background);
    --vscode-editorStickyScroll-background: var(--background);
  }
`;

export const Label = styled.div`
  font-size: 12px;
  margin: 0 0 3px 1px;
  opacity: 0.6;
  user-select: none;
`;

// export const DefaultHttlFile = styled.div`
//   margin-top: 10px;
//   animation: slide 0.2s ease-in-out;

//   @keyframes slide {
//       from {
//         opacity: 0;
//       }
//       to {
//         opacity: 1;
//       }
//   }
// `;

