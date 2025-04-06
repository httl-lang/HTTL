import { FC, PropsWithChildren, useEffect, useState } from 'react';

import * as s from './toggle.styles';

export interface ToggleProps {
  toggled: boolean;
  onToggle: (state: boolean) => void;
  className?: string;
  onOff?: (toggled: boolean) => React.ReactElement;
  title?: string;
}

const Toggle: FC<PropsWithChildren<ToggleProps>> = ({ className, toggled, title, onToggle, onOff, children }) => {
  const [enabled, setEnabled] = useState(toggled);

  useEffect(() => {
    setEnabled(toggled);
  }, [toggled]);

  const toggle = () => {
    setEnabled((value) => {
      const newState = !value;

      onToggle(newState);

      return newState;
    });
  };

  return (
    <s.Toggle onClick={toggle} enabled={+enabled} className={className} title={title}>
      {
        onOff
          ? onOff(enabled)
          : children
      }
    </s.Toggle>
  );
};

export default Toggle;