import styled from 'styled-components';

export const Container = styled.div`
  overflow: hidden;
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  border: 1px solid var(--vscode-input-border, transparent);
  border-radius: 2px;
  box-sizing: border-box;
  display: block;
  font-size: inherit;
  padding: 0;
  position: relative;
`;

export const Input = styled.textarea`
  background-color: inherit;
  color: var(--vscode-input-foreground);
  height: 24px;
  scrollbar-width: none;
  padding: 3px 0 3px 6px;
  outline: none;
  resize: none;
`;
