import { FC, PropsWithChildren, useEffect, useState } from 'react';

import * as s from './toggle.styles';

export interface ToggleProps {
  toggled: boolean;
  onToggle: (state: boolean) => void;
  className?: string;
}

const Toggle = ({ className, toggled, onToggle, children }: PropsWithChildren<ToggleProps>) => {
  const [enabled, setEnabled] = useState(toggled);

  useEffect(() => {
    setEnabled(toggled);
  }, [toggled]);

  const toggle = () => {
    onToggle(!enabled);
    setEnabled(!enabled);
  };

  return (
    <s.Toggle onClick={toggle} enabled={+enabled} className={className}>
      {children as any}
    </s.Toggle>
  );
};

export default Toggle;