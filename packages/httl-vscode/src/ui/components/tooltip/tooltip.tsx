import { FC, PropsWithChildren, useState } from "react";

import * as s from './tooltip.styles';

export interface TooltipProps {
  content: React.ReactNode;
  style?: React.CSSProperties;
}

export const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({ children, content, style }) => {
  const [visible, setVisible] = useState(false);

  return (
    <s.Container
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      style={style}
    >
      {children}
      <s.TooltipPopup
        show={visible}
        showCloseButton={false}
        hostStyle={{ display: 'contents' }}
      >
        {content}
      </s.TooltipPopup>
    </s.Container>
  );
};
