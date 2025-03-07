import React, { useMemo } from 'react';
import * as s from './combobox.styles';


interface ComboBoxProps<TItem extends { [key: string]: any }> {
  options: TItem[];
  value: TItem;
  idField: keyof TItem;
  valueField: keyof TItem;
  onChange?: (value: string) => void;
}

function ComboBox<TItem extends { [key: string]: any }>(
  { options, value, idField = "name", valueField, onChange }: ComboBoxProps<TItem>
) {

  // const cbOptions = useMemo(() => {
  //   return options.map((item) => {
  //     return {
  //       key: item[idField],
  //       value: item[valueField]
  //     };
  //   });

  // }, [options, idField, valueField]);

  const selectedOption = useMemo(() => {
    return options.find((item) => item === value);
  }, [options, value]);


  return (
    <s.Container>
      <s.Input value={selectedOption?.[valueField]} autoCorrect="off" autoCapitalize="off" spellCheck="false" />
    </s.Container>
  );
};

export default ComboBox;