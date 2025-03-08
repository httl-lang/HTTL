import React, { FC, PropsWithChildren } from "react";
import * as s from './loader.styles';

export interface LoadingTextProps {
  className?: string;
  loading?: boolean;
}

export const LoadingText: FC<PropsWithChildren<LoadingTextProps>> = ({ children, loading, className }) => {
  return (
    <s.Container className={className} loading={loading}>
      {children}
    </s.Container>
  );
}
