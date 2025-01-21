import { FC, PropsWithChildren } from 'react';

import * as s from './button.styles';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const Button = ({ onClick, disabled, children }: PropsWithChildren<ButtonProps>) => {
  return (
    <s.Button onClick={() => !disabled ? onClick() : null}>
      {children as any}
    </s.Button>
  );
};

export default Button;