import React, { PropsWithChildren, useCallback, useRef, useState } from 'react';

import * as s from './resize-panel.styles';

export interface ResizePanelProps {
  onChanges?: (height: string) => void;
  height?: string;
}

export const ResizePanel: React.FC<PropsWithChildren<ResizePanelProps>> = ({ height, children, onChanges }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  const onResize = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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
      onChanges?.(panelRef.current!.style.height);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  return (
    <s.Container>
      <s.Panel ref={panelRef} style={{ height }}>
        {children}
      </s.Panel>
      <s.Resizer onMouseDown={onResize}>
        <s.Handler />
      </s.Resizer>
    </s.Container>
  );
};