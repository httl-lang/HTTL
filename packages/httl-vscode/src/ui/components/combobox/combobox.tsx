import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as s from './combobox.styles';

interface ComboBoxProps<TItem extends { [key: string]: any }> {
  current?: TItem;
  placeholder?: string;
  keyField: keyof TItem;
  inProgress?: boolean;

  options: (search: string) => Promise<TItem[]>;
  onChange?: (value: TItem) => void;
  render: (item: TItem, label?: boolean) => React.ReactNode;
  buttons?: () => React.ReactNode;
  itemActions?: (item: TItem, current: boolean) => React.ReactNode;
}

function ComboBox<TItem extends { [key: string]: any }>(
  {
    current,
    placeholder,
    keyField,
    inProgress,
    itemActions,
    options,
    render,
    buttons,
    onChange }: ComboBoxProps<TItem>
) {
  const [showPopup, setShowPopup] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<TItem[] | undefined>(undefined);
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

  useEffect(() => {
    if (!current) {
      setShowPopup(false);
      setItems(undefined);
    }
  }, [current]);

  const onLabelClick = useCallback(async () => {
    setShowPopup(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  }, [searchText]);

  const onSelect = useCallback((item: TItem) => {
    setShowPopup(false);
    setItems(undefined);
    onChange?.(item);
  }, [searchText]);

  return (
    <s.Container>
      <s.Main progress={inProgress}>
        <s.Label onClick={() => onLabelClick()}>
          {
            current
              ? render(current, true)
              : <s.Placeholder>{placeholder}</s.Placeholder>
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && items?.length === 1) {
                onSelect(items[0]);
                setSearchText('');
              }
            }}
            placeholder={placeholder}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {loading && <s.CircleLoader />}
          <s.Select>
            {
              items?.length === 0
                ? <s.SelectItem>No projects found</s.SelectItem>
                : items?.sort((a, b) => current?.[keyField] === a[keyField] ? -1 : 0)
                  .map((item, index) => (
                    <s.SelectItem key={index} onClick={() => onSelect(item)} focused={items.length === 1 || current?.[keyField] === item[keyField]}>
                      <s.Item>
                        {render(item)}
                      </s.Item>
                      <s.ItemActions>
                        {itemActions && itemActions(item, current?.[keyField] === item[keyField])}
                      </s.ItemActions>
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