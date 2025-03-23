import { LoadingText } from '../../../../components/loading-text';
import styled, { css } from 'styled-components';
import { ResizePanel } from '../../../../components/resize-panel';
import Button from '../../../../components/button';
import { VscCircleFilled } from 'react-icons/vsc';
import { MethodLabel } from '../../../../components/method-label';

export const Container = styled.div`
  position: relative;
  flex: 1;
  overflow-y: auto;
  scrollbar-color: auto;
  &::-webkit-scrollbar {
    width: 2px;
  }
`;

export const RunButton = styled(Button)`
  visibility: hidden;

  &:hover {
    visibility: visible;
    opacity: 1 !important;
  }
`;

export const Name = styled.div`
  flex: 1;
  transition: opacity 0.02s;
  filter: brightness(0.9);

  & small {
    color: color-mix(in srgb, var(--vscode-input-foreground) 40%, transparent);
    font-size: 10px;
    margin-left: 10px;
  }
`;

export const MethodLabelStyled = styled(MethodLabel)`
  font-size: 11px;
`;

export const Panel = styled.div<{ expanded?: boolean, highlighted?: boolean }>`
  margin: 6px 6px 4px 6px;
  background-color: var(--vscode-editor-background);
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  outline: 1px solid var(--vscode-chat-requestBorder, var(--vscode-input-background, transparent));

  ${p => p.highlighted && css`
    outline: 1px solid var(--vscode-textLink-activeForeground) !important;
  `}
  
  &:hover {
    outline-color: var(--vscode-commandCenter-activeBorder);
    
    ${Name} {
      filter: none;
    }

    ${RunButton} {
      visibility: visible;
      opacity: 0.5;
    }
  }
  
  ${p => p.expanded && css`
    background-color: transparent;

    & ${Name} {
      opacity: 0.6;
    }

    & ${RunButton} {
      visibility: visible;
    }

    &:hover {
      & ${RunButton} {
        opacity: 1 !important;
      }
    }
    
  `}

  transition: background-color 0.05s;
`;

export const Header = styled.div`
  position: relative;
  user-select: none;
  font-size: 12px;
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: pointer;
`;

export const HasScriptIndicator = styled(VscCircleFilled)`
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0.3;
  font-size: 9px;
`;


export const Editor = styled(ResizePanel)`
  --background: var(--vscode-editor-background);

  position: relative;
  margin: 0 5px;
  padding: 5px 5px 0 5px;
  border-radius: 5px;
  background-color: var(--background);

  .monaco-editor {
    --vscode-editor-background: var(--background);
    --vscode-editorStickyScroll-background: var(--background);
  }
`;

export const Expanded = styled.div`

`;

export const ToolBar = styled.div`
  display: flex;
  padding: 3px 10px 9px;
  gap: 10px;
  font-size: 9px;
  color: color-mix(in srgb, var(--vscode-input-foreground) 70%, transparent);

  & span:hover {
    cursor: pointer;
    color: var(--vscode-input-foreground);
  }

  &:hover {
    opacity: 1;
  }

  & a {
    color: var(--vscode-input-foreground);
    font-weight: var(--vscode-font-weight);
    font-family: var(--vscode-font-family);

    display: flex;
    font-size: 10px;
    gap: 3px;
    font-variant-caps: all-petite-caps;
    padding: 3px 5px;
    border-radius: 3px;

    opacity: 0.7;

    &:hover {
      opacity: 1;
    }

    & svg {
      font-size: 10px;
    }

    & span {
      margin-top: -1px;
      pointer-events: none;
    }
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