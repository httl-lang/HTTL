import { FC, PropsWithChildren } from 'react';

import * as s from './button.styles';
import { Loader } from '../loader';

export interface ButtonProps {
  onClick: () => void;
  progress?: boolean;
  className?: string;
  title?: string;
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({ onClick, progress, children, className, title }) => {
  return (
    <s.Button
      className={className}
      title={title}
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