import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as s from './combobox.styles';

interface ComboBoxProps<TItem extends { [key: string]: any }> {
  current?: TItem;
  placeholder?: string;
  keyField: keyof TItem;
  options: (search: string) => Promise<TItem[]>;
  onChange?: (value: TItem) => void;

  render: (item: TItem) => React.ReactNode;
  buttons?: () => React.ReactNode;
}

function ComboBox<TItem extends { [key: string]: any }>(
  { current, placeholder, options, render, buttons, onChange }: ComboBoxProps<TItem>
) {
  const [showPopup, setShowPopup] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<TItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showPopup) {
      return;
    }

    (async () => {
      setLoading(true);

      try {
        const items = await options(searchText);
        setItems(items);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);

    })();

  }, [searchText, showPopup]);

  const onLabelClick = useCallback(async () => {
    setShowPopup(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  }, [searchText]);

  const onSelect = useCallback((item: TItem) => {
    setShowPopup(false);
    setItems([]);
    onChange?.(item);
  }, [searchText]);

  return (
    <s.Container>
      <s.Main>
        <s.Label onClick={() => onLabelClick()}>
          {
            current
              ? render(current)
              : placeholder
          }
        </s.Label>
        {
          buttons &&
          <s.Buttons>
            {buttons()}
          </s.Buttons>
        }
      </s.Main>

      <s.PopupPanel show={showPopup} onClose={() => setShowPopup(false)}>
        <s.PopupBody>
          <s.Input
            ref={inputRef}
            value={searchText}
            placeholder={placeholder}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {loading && <s.CircleLoader />}
          <s.Select>
            {
              items.map((item, index) => (
                <s.SelectItem key={index} onClick={() => onSelect(item)}                >
                  {render(item)}
                </s.SelectItem>
              ))
            }
          </s.Select>
        </s.PopupBody>
      </s.PopupPanel>
    </s.Container>
  );
};

export default ComboBox;