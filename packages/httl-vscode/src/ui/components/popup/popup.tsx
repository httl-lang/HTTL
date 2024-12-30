import React, { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import * as s from './popup.styles';
import { Commutator } from '../../services/commutator';

interface PopupProps {
  show: boolean;
  onClose?: () => void;
  style?: React.CSSProperties;
}

const Popup: FC<PropsWithChildren<PopupProps>> = ({ show, style, children, onClose }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [showState, setShowState] = useState(show);

  useEffect(() => {
    setShowState(show);
  }, [show]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (showState && !hostRef.current?.contains(event.target as any)) {
        setShowState(false);
        onClose?.();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowState(false);
        onClose?.();
      }
    };

    const onMessage = (event: MessageEvent<any>) => {
      if (Commutator.isUserCommand(event.data)) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClick);
    window.addEventListener('message', onMessage, true);
    // document.addEventListener('mouseleave', onDocMouseleave);

    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('message', onMessage);
      // document.removeEventListener('mouseleave', onDocMouseleave);
    };
  }, [showState]);



  return (
    <s.Host ref={hostRef} show={+showState}>
      <s.Popup style={style}>
        {children}
      </s.Popup>
    </s.Host>
  );
};

export default Popup;