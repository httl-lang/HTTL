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

export const Controls = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    gap: 5px;
    z-index: 100;
    padding: 2px;
    & a {
        color: #5d5d5d !important;
    }
`;