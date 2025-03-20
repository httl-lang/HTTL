import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';

import * as s from './button.styles';
import { Loader } from '../loader';

export interface ButtonProps {
  onClick: (stop?: boolean) => Promise<void> | void;
  disabled?: boolean;
  progress?: boolean;
  className?: string;
  title?: string;
  disableLoading?: boolean;
  small?: boolean;
  allowStop?: boolean;
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({ onClick, disabled, children, className, progress, title, disableLoading, allowStop, small = false }) => {
  const [loading, setLoading] = useState(progress);

  useEffect(() => {
    setLoading(progress);
  }, [progress]);

  const handleOnClick = useCallback(async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.stopPropagation();

    if (!disabled && (!loading || allowStop)) {
      const result = onClick(loading);
      if (result instanceof Promise && !disableLoading) {
        setLoading(true);
        result.finally(() => setLoading(false));
      }
    }
  }, [disabled, loading, disableLoading, allowStop]);

  return (
    <s.Button
      className={className}
      title={title}
      onClick={handleOnClick}
      disabled={disabled}
      small={small}
    >
      {
        disabled
          ? children
          : loading
            ? <Loader stopIcon={allowStop} />
            : children
      }
    </s.Button>
  );
};

export default Button;