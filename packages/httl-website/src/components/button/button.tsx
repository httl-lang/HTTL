import { FC, PropsWithChildren } from 'react';

import * as s from './button.styles';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const Button = ({ onClick, disabled, children, className }: PropsWithChildren<ButtonProps>) => {
  return (
    <s.Button onClick={() => !disabled ? onClick() : null} className={className}>
      {children as any}
    </s.Button>
  );
};

export default Button;