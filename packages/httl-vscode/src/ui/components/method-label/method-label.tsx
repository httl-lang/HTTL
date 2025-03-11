import React, { FC, PropsWithChildren } from "react";
import * as s from './method-label.styles';

export interface MethodLabelProps {
  method: string;
}

export const MethodLabel: FC<MethodLabelProps> = ({ method }) => {
  return (
    <s.Label method={method}>
      {method}
    </s.Label>
  );
}
