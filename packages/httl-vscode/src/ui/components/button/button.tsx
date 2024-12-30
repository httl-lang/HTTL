import { FC, PropsWithChildren } from 'react';

import * as s from './button.styles';

interface ButtonProps {
  onClick: () => void;
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({ onClick, children }) => {
  return (
    <s.Button onClick={onClick}>
      {children}
    </s.Button>
  );
};

export default Button;