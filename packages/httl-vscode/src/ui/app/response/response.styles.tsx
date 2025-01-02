import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

export const Badge = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff7e00;
  color: #000;
  font-weight: 500;
  font-variant-caps: all-petite-caps;
  padding: 0 4px;
  font-size: 10px;
  padding: 0 6px 3px;
  border-radius: 0px 0px 6px 6px;
  z-index: 100;
`;
