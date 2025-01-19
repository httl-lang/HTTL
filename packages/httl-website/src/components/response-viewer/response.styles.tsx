import styled from 'styled-components';
import Toggle from '../toggle';

export const ResponseView = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0 7px;
`;

export const ActionBar = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
  color: var(--vscode-tab-inactiveForeground);
  font-size: 12px;
`;

export const ToggleAction = styled(Toggle)`
  padding: 6px 10px;
  cursor: pointer;
  color: ${props => props.toggled ? 'var(--vscode-tab-activeForeground)' : 'var(--vscode-tab-inactiveForeground)'};
`;

export const Information = styled.div`
  flex: 1;
  display: flex;
  gap: 7px;
  justify-content: end;
  align-items: center;
  line-height: 12px;
`;

export const InfoItem = styled.div`
  cursor: default;
`;

export const Circle = styled.div`
  content: "";
  height: 4px;
  width: 4px;
  border-radius: 2px;
  background-color: #3b3b3b;
  display: inline-flex;
`;

export const Response = styled.div`
  height: 100%;
  width: 100%;
  flex: 1;
`;

