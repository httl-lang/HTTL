import React from "react";
import * as s from './loader.styles';

export interface LoaderProps {
  className?: string;
  stopIcon?: boolean;
}

export function Loader({ className, stopIcon }: LoaderProps) {
  return (
    <s.Container className={className}>
      <s.Loader xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 384">
        <s.ActiveCircle
          r="176"
          cy="192"
          cx="192"
          strokeWidth="32"
          fill="transparent"
          pathLength="360"
        ></s.ActiveCircle>
        <s.TrackCircle
          r="176"
          cy="192"
          cx="192"
          strokeWidth="32"
          fill="transparent"
          pathLength="360"
        ></s.TrackCircle>
      </s.Loader>
      {stopIcon && <s.StopIcon />}
    </s.Container>
  );
}
