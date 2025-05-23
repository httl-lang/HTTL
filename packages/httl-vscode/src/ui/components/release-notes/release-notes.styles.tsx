import styled from 'styled-components';
import Popup from '../popup';

export const ReleaseNotesPopup = styled(Popup)`
    font-size: 10px;
    bottom: 10px;
    position: fixed;
    top: auto;
    right: 10px;
    width: 300px;
    animation: slideInFromBottom 0.5s ease-in-out;

    @keyframes slideInFromBottom {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    & > h3 {
        font-size: 12px;
    }
`;