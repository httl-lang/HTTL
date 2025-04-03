import React, { FC, PropsWithChildren } from "react";
import * as s from './method-label.styles';

export interface MethodLabelProps {
  method: string;
  className?: string;
}

export const MethodLabel: FC<MethodLabelProps> = ({ method, className }) => {
  return (
    <s.Label method={method} className={className}>
      {method}
    </s.Label>
  );
};
