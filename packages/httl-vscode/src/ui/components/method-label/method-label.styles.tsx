import styled, { css } from 'styled-components';

const getColor = (method: string) => {
  switch (method.toLowerCase()) {
    case 'get':
      return '#6bdd9a';
    case 'post':
      return '#ffe47e';
    case 'put':
      return '#74aef6';
    case 'delete':
      return '#f79a8e';
    case 'patch':
      return '#c0a8e1';
    case 'head':
      return '#6bdd9a';
    case 'options':
      return '#f15eb0';
    default:
      return 'white';
  }
};

export const Label = styled.span<{ method: string }>`
  font-weight: 500;
  margin-right: 6px;
  color: ${props => getColor(props.method)};
  text-transform: uppercase;
`;
