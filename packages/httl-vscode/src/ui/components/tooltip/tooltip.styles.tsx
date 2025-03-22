import styled from 'styled-components';
import Popup from '../popup';

export const Container = styled.div`
    cursor: pointer;
    user-select: none;
    
    border-radius: 5px;
    padding: 3px;

    &:hover {
      background-color: var(--vscode-toolbar-hoverBackground);
    }
`;


export const TooltipPopup = styled(Popup)`
    transform: translate(-50%, 7px);
    top: inherit;
    font-size: 10px;
    max-width: 160px;
`;

