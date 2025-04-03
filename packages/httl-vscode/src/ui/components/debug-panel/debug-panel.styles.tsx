import styled from 'styled-components';
import Popup from '../../components/popup';

export const Container = styled(Popup)`
    font-size: 12px;
    bottom: 10px;
    position: fixed;
    top: auto;
    right: 50%;
    transform: translateX(50%);
    width: 300px;
    animation: debugSlideInFromBottom 0.5s ease-in-out;

    @keyframes debugSlideInFromBottom {
        from {
            transform: translate(50%, 100%);
            opacity: 0;
        }
        to {
            transform: translate(50%, 0);
            opacity: 1;
        }
    }
`;