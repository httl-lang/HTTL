import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: var(--vscode-diffEditor-unchangedRegionBackground);
  overflow: hidden;
  position: relative;
`;

export const Label = styled.div<{ center?: boolean }>`
  font-size: 10px;
  margin: 0 10px 0;
  opacity: 0.3;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: ${p => p.center ? 'center' : 'flex-start'};
`;

export const ErrorToast = styled.div`
  position: absolute;
  bottom: 15px;
  left: 10px;
  right: 10px;
  z-index: 1000;
  
  display: flex;
  align-items: center;
  gap: 5px;

  cursor: pointer;
  background-color: #5d2222;
  border: 1px solid #9a1b1b;
  border-radius: 4px;
  box-sizing: border-box;

  padding: 2px 6px;
  flex: 1;

  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;

  animation: slideInFromBottom 0.5s ease-in-out;

  &:hover {
      border-color: var(--vscode-commandCenter-activeBorder);
  }

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
`;