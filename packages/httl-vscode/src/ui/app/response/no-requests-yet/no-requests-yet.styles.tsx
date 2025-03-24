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
  max-width: 350px;
  text-align: center;
  margin: 10px 0;
`;

export const SubMessage = styled.div`
  max-width: 350px;
  text-align: center;
  margin: 10px 0;
  font-size: 12px;
  opacity: 0.7;
`;