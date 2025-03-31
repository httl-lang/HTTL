import styled from 'styled-components';
import { VscCopilot } from 'react-icons/vsc';
import Logo from '../../../components/logo';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;

  opacity: 0;
  animation: showExecutingRequest 0.2s forwards 0.3s;

  @keyframes showExecutingRequest {
    from {
        transform: translateY(5%);
        opacity: 0;
    }
    to {
      transform: translateY(0);
        opacity: 1;
    }
  }
`;

export const Icons = styled.div`
  display: flex;
  align-items: center;
  line-height: 8px;
  font-size: 20px;
  font-weight: 100;
`;

export const HttlLogo = styled(Logo)`
  color: #0090FF;
  opacity: 0.5;
`;


export const Message = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  text-align: center;
  margin: 10px;
  font-size: 12px;
  opacity: 0.7;
  gap: 10px;
  padding: 10px;
  background: var(--vscode-diffEditor-unchangedRegionBackground);
  border-radius: 6px;
`;

export const FileName = styled.span`
  font-weight: 600;
`;