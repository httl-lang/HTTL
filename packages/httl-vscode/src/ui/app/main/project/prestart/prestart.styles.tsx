import styled from 'styled-components';

import { ResizePanel } from '../../../../components/resize-panel';

export const Container = styled.div`
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  margin: 6px;
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
