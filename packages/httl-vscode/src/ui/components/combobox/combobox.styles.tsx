import styled, { css } from 'styled-components';
import Popup from '../popup';
import { Loader } from '../loader';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const Main = styled.div<{ progress?: boolean }>`
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

  &:hover {
    border-color: var(--vscode-commandCenter-activeBorder);
  }

  ${({ progress }) => progress && css`

    background: linear-gradient(90deg, var(--vscode-input-background) 25%, var(--vscode-input-border) 50%, var(--vscode-input-background) 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite linear;

    @keyframes loading {
      0% {
          background-position: 200% 0;
      }
      100% {
          background-position: -200% 0;
      }
    }
  `}
`;

export const Label = styled.div`
  background-color: inherit;
  height: 24px;
  padding: 3px 3px 3px 6px;
  flex: 1;
  overflow: hidden;
`;

export const Placeholder = styled.div`
  color: var(--vscode-input-placeholderForeground);
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 18px;
`;

export const Input = styled.input`
  background-color: inherit;
  height: 24px;
  border-radius: 2px;
  scrollbar-width: none;
  padding: 3px 0 3px 6px;
  outline: none;
  resize: none;
  flex: 1;
`;

export const Buttons = styled.div`
  margin: 1px;
  display: flex;

  & a {
    color: var(--vscode-icon-foreground);
  }
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
  max-height: 300px;
  overflow-y: auto;
  scrollbar-gutter: stable;
  scrollbar-color: auto;
  &::-webkit-scrollbar {
    width: 2px;
  }
`;

export const Item = styled.div`
  flex: 1;
  overflow: hidden;
`;

export const SelectItem = styled.div<{ focused?: boolean }>`
  display: flex;
  align-items: center;

  cursor: pointer;
  border-radius: 3px;
  padding: 3px 6px;
  width: 100%;
  color: var(--vscode-quickInputList-focusForeground);

  &:hover {
    background-color: var(--vscode-list-hoverBackground);
  }

  ${({ focused }) => focused && css`
    background-color: var(--vscode-quickInputList-focusBackground) !important;
  `}
`;

export const ItemActions = styled.div`
`;

export const CircleLoader = styled(Loader)`
  position: absolute;
  right: 10px;
  top: 14px;
  opacity: 0;
  animation: show 0.3s forwards 0.5s;

  @keyframes show {
      from {
          opacity: 0;
      }
      to {
          opacity: 0.6;
      }
  }
`;

export const Divider = styled.div`
  height: 1px;
  background: var(--vscode-editorGroup-border);
  margin: 3px 0;
`;