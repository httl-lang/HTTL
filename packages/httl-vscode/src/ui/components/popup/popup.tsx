import React, { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import * as s from './popup.styles';
import { Commutator } from '../../services/commutator';
import Button from '../button';
import { VscClose } from 'react-icons/vsc';

export interface PopupProps {
  show: boolean;
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  onClose?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const Popup: FC<PropsWithChildren<PopupProps>> = ({ show, style, children, showCloseButton, closeOnEscape = true, onClose, className }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [showState, setShowState] = useState(show);

  useEffect(() => {
    setShowState(show);
  }, [show]);

  useEffect(() => {
    if (!closeOnEscape) {
      return;
    }

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

    const onBlur = () => {
      onClose?.();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClick);
    window.addEventListener('message', onMessage, true);
    window.addEventListener('blur', onBlur);


    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('message', onMessage);
      window.removeEventListener('blur', onBlur);
    };
  }, [showState, closeOnEscape]);

  return (
    <s.Host ref={hostRef} show={+showState} >
      <s.Popup style={style} className={className}>
        {showCloseButton && (
          <s.Controls>
            <Button onClick={() => { setShowState(false); onClose?.(); }} >
              <VscClose />
            </Button>
          </s.Controls>
        )}

        {children}
      </s.Popup>
    </s.Host>
  );
};

export default Popup;