import styled from 'styled-components';

export const Host = styled.div<{ show: number }>`
    display: ${({ show }) => show ? 'block' : 'none'};
    position: relative;
`;

export const Popup = styled.div`
    background-color: var(--vscode-quickInput-background);
    border: 1px solid var(--vscode-widget-border);
    box-shadow: 0 0 8px 2px var(--vscode-widget-shadow);
    top: 6px;
    position: absolute;
    z-index: 2550;
    -webkit-app-region: no-drag;
    border-radius: 6px;
    padding: 7px;
    width: 100%;
`;