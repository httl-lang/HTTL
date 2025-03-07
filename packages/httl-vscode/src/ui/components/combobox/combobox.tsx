import React, { useMemo } from 'react';
import * as s from './combobox.styles';

interface ComboBoxProps<TItem extends { [key: string]: any }> {
  options: TItem[];
  value: TItem;
  render: (item: TItem) => React.ReactNode;
  onChange?: (value: string) => void;
}

function ComboBox<TItem extends { [key: string]: any }>(
  { options, value, render, onChange }: ComboBoxProps<TItem>
) {

  const selectedOption = useMemo(() => {
    return options.find((item) => item === value);
  }, [options, value]);

  return (
    <s.Container>
      <s.Label>
        {selectedOption && render(selectedOption)}
      </s.Label>
    </s.Container>
  );
};

export default ComboBox;