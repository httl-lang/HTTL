import styled from 'styled-components';
import { VscCopilot } from 'react-icons/vsc';
import Logo from '../../components/logo';
import Button from '../button';

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
  color: #ff0066;
`;

export const Details = styled.div`
  max-width: 250px;
  overflow: auto;
  scrollbar-color: auto;
  background-color: var(--vscode-editor-background);
  border-radius: 5px;
  padding: 10px;
`;

export const Message = styled.div`
  max-width: 350px;
  text-align: center;
  margin: 10px 0;
  margin-top: 30px;
`;

export const SubMessage = styled.div`
  width: 250px;
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

export const CloseButton = styled(Button)`
  position: fixed;
  top: 10px;
  right: 10px;
`;

