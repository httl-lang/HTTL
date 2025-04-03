import styled from 'styled-components';
import { VscCopilot } from 'react-icons/vsc';
import Logo from '../../../../components/logo';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
  padding: 0 10px 150px 10px;
`;

export const Icons = styled.div`
  display: flex;
  align-items: center;
  line-height: 8px;
  gap: 10px;
  font-size: 20px;
  font-weight: 100;
`;

export const HttlLogo = styled(Logo)`
  color: #0090FF;
`;

export const CopilotLogo = styled(VscCopilot)`
  font-size: 37px;
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 500;
  margin-top: 10px;

`;

export const Indicator = styled.div`
  font-size: 0.9rem;
  color: gray;
  margin-top: 5px;
`;

export const Message = styled.div`
  max-width: 350px;
  text-align: center;
  margin: 10px 0;
  margin-top: 30px;
`;

export const SubMessage = styled.div`
  max-width: 350px;
  text-align: center;
  margin: 10px 0;
  font-size: 12px;
  opacity: 0.7;
`;


export const Caption = styled.div`
  font-size: 24px;
  font-weight: 500;
  justify-content: center;
  display: flex;
  align-items: end;
  margin-top: 15px;
`;