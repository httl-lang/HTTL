import { LoadingText } from '../../../../components/loading-text';
import styled, { css } from 'styled-components';
import { ResizePanel } from '../../../../components/resize-panel';

export const Container = styled.div`
  position: relative;
  flex: 1;
  overflow-y: auto;
  scrollbar-color: auto;
  &::-webkit-scrollbar {
    width: 2px;
  }
`;

export const Name = styled.div`
  flex: 1;
  transition: opacity 0.02s;
  /* opacity: 0.8; */
`;

export const Panel = styled.div<{ expanded?: boolean }>`
  margin: 6px;
  background-color: var(--vscode-editor-background);
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  outline: 1px solid var(--vscode-chat-requestBorder, var(--vscode-input-background, transparent));
  
  &:hover {
    outline-color: var(--vscode-commandCenter-activeBorder);
    
    /* ${Name} {
      opacity: 1;
    } */
  }
  
  ${p => p.expanded && css`
    /* background-color: var(--vscode-editor-background); //var(--vscode-input-background); */
    background-color: transparent;
    /* border: 1px solid var(--vscode-input-background); */
    /* outline: 1px solid var(--vscode-input-background);

    &:hover {
      outline-color: var(--vscode-commandCenter-activeBorder);
    } */

    & ${Name} {
      opacity: 0.2;
    }
  `}

  transition: background-color 0.05s;
`;

export const Header = styled.div`
  user-select: none;
  font-size: 12px;
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: pointer;
`;


export const Editor = styled(ResizePanel)`
  --background: var(--vscode-editor-background);

  margin: 0 5px 5px 5px;
  padding: 5px 5px 0 5px;
  border-radius: 5px;
  background-color: var(--background);

  .monaco-editor {
    --vscode-editor-background: var(--background);
    --vscode-editorStickyScroll-background: var(--background);
  }
`;


export const Label = styled(LoadingText) <{ center?: boolean, dark?: boolean }>`
  font-size: 10px;
  margin: 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: ${p => p.center ? 'center' : 'flex-start'};
  color: ${p => p.dark ? 'color-mix(in srgb, var(--vscode-input-foreground) 70%, transparent)' : 'inherit'};
`;

export const EndpointGroup = styled.div`
  margin-bottom: 20px;
`;

export const EndpointTag = styled(LoadingText) <{ dark?: boolean }>`
  font-size: 14px;
  margin: 0 10px 0;
  display: flex;
  
  & h1 {
    font-weight: 500;
    font-variant-caps: all-petite-caps;
    font-size: 14px;
  }

  & h1::before {
    content: '📦';
    margin-right: 3px;
  }

  & small {
    color: color-mix(in srgb, var(--vscode-input-foreground) 70%, transparent);
    font-size: 10px;
    margin-left: 10px;
    line-height: 17px;
  }
`;