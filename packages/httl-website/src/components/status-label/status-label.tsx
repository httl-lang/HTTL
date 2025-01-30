import { FC, useMemo } from 'react';

import * as s from './status-label.styles';
import { CODE_COLORS, HTTP_CODES } from './codes';

export interface StatusLabelProps {
  value: string | number;
}

const StatusLabel = ({ value }: StatusLabelProps) => {
  const statusText = useMemo(() => {
    return `${value} ${HTTP_CODES[value.toString()] || 'Unknown'}`;
  }, [value]);

  const statusStyle = useMemo(() => {
    return CODE_COLORS[value.toString()[0] + 'xx'] || CODE_COLORS.default;
  }, [value]);

  if (!value) {
    return "ERR:Unknown";
  }

  return (
    <s.StatusLabel style={statusStyle}>
      {statusText}
    </s.StatusLabel>
  );
};

export default StatusLabel;