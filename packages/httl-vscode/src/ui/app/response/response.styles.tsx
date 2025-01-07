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
  background-color: #dc6e17;
  color: #000;
  font-weight: bold;
  font-variant-caps: all-petite-caps;
  font-size: 9px;
  padding: 0 6px 3px;
  border-radius: 0px 0px 3px 3px;
  z-index: 100;
  line-height: 4px;
  user-select: none;
`;
