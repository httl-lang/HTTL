import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';

import * as s from './button.styles';
import { Loader } from '../loader';

export interface ButtonProps {
  onClick: () => Promise<void> | void;
  disabled?: boolean;
  progress?: boolean;
  className?: string;
  title?: string;
  disableLoading?: boolean;
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({ onClick, disabled, children, className, progress, title, disableLoading }) => {
  const [loading, setLoading] = useState(progress);

  useEffect(() => {
    setLoading(progress);
  }, [progress]);

  const handleOnClick = useCallback(async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.stopPropagation();

    if (!disabled && !loading) {
      const result = onClick();
      if (result instanceof Promise && !disableLoading) {
        setLoading(true);
        result.finally(() => setLoading(false));
      }
    }
  }, [disabled, loading, disableLoading]);

  return (
    <s.Button
      className={className}
      title={title}
      onClick={handleOnClick}
      disabled={disabled}
    >
      {
        disabled
          ? children
          : loading
            ? <Loader />
            : children
      }
    </s.Button>
  );
};

export default Button;