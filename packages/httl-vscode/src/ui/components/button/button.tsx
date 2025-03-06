import { FC, PropsWithChildren } from 'react';

import * as s from './button.styles';
import { Loader } from '../loader';

interface ButtonProps {
  onClick: () => void;
  progress?: boolean;
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({ onClick, progress, children }) => {
  return (
    <s.Button onClick={() => !progress && onClick()}>
      {
        progress ? <Loader /> : children
      }
    </s.Button>
  );
};

export default Button;