import styled from 'styled-components';
import { LoadingText } from '../../../../components/loading-text';
import Button from '../../../../components/button';

export const Container = styled.div`
  position: relative;
  flex: 1;
  overflow-y: auto;
  scrollbar-gutter: stable;
  scrollbar-color: auto;
  &::-webkit-scrollbar {
    width: 2px;
  }
`;

export const ScrollShadow = styled.div`
  box-shadow: var(--vscode-scrollbar-shadow) 0 6px 6px -6px inset;
  height: 6px;
  left: 0;
  top: 0;
  width: 100%;
  position: sticky;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
`;

export const Label = styled(LoadingText) <{ center?: boolean, dark?: boolean }>`
  font-size: 13px;
  user-select: none;
  font-variant-caps: all-petite-caps;
  display: flex;
  align-items: center;
  justify-content: ${p => p.center ? 'center' : 'flex-start'};
  color: ${p => p.dark ? 'color-mix(in srgb, var(--vscode-input-foreground) 60%, transparent)' : 'inherit'};
`;

export const EndpointGroup = styled.div`
  margin-bottom: 20px;
`;

export const EndpointTag = styled(LoadingText) <{ dark?: boolean }>`
  font-size: 14px;
  margin: 0 10px 0;
  display: flex;
  align-items: end;
  gap: 5px;
  
  & h1 {
    font-variant-caps: all-petite-caps;
    font-size: 15px;
    color: var(--vscode-inputOption-activeForeground);
  }

  & small {
    color: color-mix(in srgb, var(--vscode-input-foreground) 70%, transparent);
    font-size: 10px;
    margin-left: 10px;
    line-height: 17px;
  }

  & svg {
    color: color-mix(in srgb, var(--vscode-input-foreground) 70%, transparent);
  }
`;


export const SpecButton = styled(Button)`
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

export const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 6px 0px 10px;
  height: 30px;
  border-bottom: 0.5px solid color-mix(in srgb, var(--vscode-editorGroup-border) 40%, transparent);
`;