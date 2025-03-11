import { LoadingText } from '../../../../components/loading-text';
import styled, { css } from 'styled-components';

export const Container = styled.div`
`;

export const Endpoint = styled.div<{ expanded?: boolean }>`
  cursor: pointer;
  user-select: none;
  font-size: 12px;

  ${p => p.expanded && css`
    opacity: 0.4;
  `}

  transition: opacity 0.1s;
`;

export const EndpointEditor = styled.div`
  margin-top: 5px;
  height: 100px;

  padding: 5px;
  border-radius: 5px;
  --background: var(--vscode-editor-background);

  
  background-color: var(--background);

  .monaco-editor {
    --vscode-editor-background: var(--background);
    --vscode-editorStickyScroll-background: var(--background);
  }
`;

export const Panel = styled.div<{ expanded?: boolean }>`
  padding: 5px;
  margin: 6px;
  background-color: var(--vscode-editor-background);
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  ${p => p.expanded && css`
    background-color: var(--vscode-input-background);
  `}
  
  transition: background-color 0.05s;
`;

export const Label = styled(LoadingText) <{ center?: boolean, dark?: boolean }>`
  font-size: 10px;
  margin: 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: ${p => p.center ? 'center' : 'flex-start'};
  color: ${p => p.dark ? 'color-mix(in srgb, var(--vscode-input-foreground) 70%, transparent)' : 'inherit'};
`;


export const ControllerTag = styled(LoadingText) <{ dark?: boolean }>`
  font-size: 14px;
  margin: 0 10px 0;
  display: flex;
  
  & h1 {
    font-weight: 500;
    font-variant-caps: all-petite-caps;
    font-size: 12px;
  }

  & h1::before {
    content: '📦';
    margin-right: 5px;
  }

  & small {
    color: color-mix(in srgb, var(--vscode-input-foreground) 70%, transparent);
    font-size: 10px;
    margin-left: 10px;
    line-height: 17px;
  }
`;