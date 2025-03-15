import { FC, PropsWithChildren, useCallback, useState } from 'react';

import * as s from './button.styles';
import { Loader } from '../loader';

export interface ButtonProps {
  onClick: () => Promise<void> | void;
  disabled?: boolean;
  className?: string;
  title?: string;
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({ onClick, disabled, children, className, title }) => {
  const [loading, setLoading] = useState(false);

  const handleOnClick = useCallback(async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.stopPropagation();

    if (!disabled && !loading) {
      const result = onClick();
      if (result instanceof Promise) {
        setLoading(true);
        result.finally(() => setLoading(false));
      }
    }
  }, []);

  return (
    <s.Button
      className={className}
      title={title}
      onClick={handleOnClick}
      disabled={disabled}
    >
      {
        loading
          ? <Loader />
          : children
      }
    </s.Button>
  );
};

export default Button;