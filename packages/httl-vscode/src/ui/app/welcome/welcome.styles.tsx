import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  overflow: auto;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

export const Welcome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
`;

export const Icon = styled.div`
  height: 35%;
  display: flex;
  align-items: end;
  color: #0090FF;
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
  margin-top: 20px;
  text-align: center;
    margin: 10px 0;
`;

export const Caption = styled.div`
 font-size: 24px;
  font-weight: 500;
  justify-content: center;
  display: flex;
  align-items: end;
`;