import { FC, PropsWithChildren } from 'react';

import * as s from './button.styles';
import { Loader } from '../loader';

export interface ButtonProps {
  onClick: () => void;
  progress?: boolean;
  className?: string;
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({ onClick, progress, children, className }) => {
  return (
    <s.Button
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        !progress && onClick();
      }}>
      {
        progress ? <Loader /> : children
      }
    </s.Button>
  );
};

export default Button;