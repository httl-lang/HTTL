import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';

import * as s from './resize-panel.styles';

export interface ResizePanelProps {
  onResize?: (height: string) => void;
  height?: string;
  className?: string;
  onResizeDoubleClick?: () => void;
  title?: string;
}

export const ResizePanel: React.FC<PropsWithChildren<ResizePanelProps>> = ({ height, children, className, title, onResize, onResizeDoubleClick }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  const onHandleResize = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const startY = e.clientY;
    const startHeight = panelRef.current!.offsetHeight;

    const onMouseMove = (e: any) => {
      const newHeight = startHeight + (e.clientY - startY);
      panelRef.current!.style.height = `${newHeight}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      onResize?.(panelRef.current!.style.height);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.style.height = height || 'auto';
    }
  }, [height]);

  return (
    <s.Container className={className}>
      <s.Panel ref={panelRef} style={{ height }}>
        {children}
      </s.Panel>
      <s.Resizer onMouseDown={onHandleResize} onDoubleClick={onResizeDoubleClick} title={title}>
        <s.Handler />
      </s.Resizer>
    </s.Container>
  );
};