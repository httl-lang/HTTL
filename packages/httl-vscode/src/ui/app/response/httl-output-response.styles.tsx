import styled, { css } from 'styled-components';
import Toggle from '../../components/toggle';

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

export const SourceLink = styled.a<{ type?: string }>`
  cursor: pointer;

  opacity: 0.7;

  &:hover {
    text-decoration: underline;
    opacity: 1;
  }

  /* ${props => props.type === 'quick-run' && css`
    color: #ff6700;
    font-variant-caps: all-petite-caps;
    opacity: 1;
  `} */

  ${props => props.type === 'quick-run'
    ? css`
      color: #ff6700;
      font-variant-caps: all-petite-caps;
      opacity: 1;
    `
    : css`
      color: var(--vscode-textLink-foreground);

      &::before {
        content: '${props.type}:';
        color: var(--vscode-tab-inactiveForeground);
        margin-right: 5px;
        font-size: 12px;
        font-variant-caps: all-petite-caps;
        display: inline-block;

        &:hover {
          text-decoration: none !important;
        }
      }
    `
  }
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

