import { LoadingText } from '../../../../components/loading-text';
import styled, { css } from 'styled-components';
import { ResizePanel } from '../../../../components/resize-panel';
import Button from '../../../../components/button';
import { VscCircleFilled } from 'react-icons/vsc';

export const Container = styled.div`
  position: relative;
  flex: 1;
  overflow-y: auto;
  scrollbar-color: auto;
  &::-webkit-scrollbar {
    width: 2px;
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