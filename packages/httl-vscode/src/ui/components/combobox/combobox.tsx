import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as s from './combobox.styles';

interface ComboBoxProps<TItem extends { [key: string]: any, divider?: boolean }> {
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
  const [focused, setFocused] = useState<number>(-1);

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
    setFocused(
      items?.length === 1
        ? 0
        : items?.findIndex(c => c[keyField] === current?.[keyField]) ?? -1
    );
  }, [items, current, keyField, showPopup]);


  useEffect(() => {
    if (!current) {
      setShowPopup(false);
      setItems(undefined);
      setFocused(-1);
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
    setFocused(-1);
    onChange?.(item);
  }, [searchText]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (items?.[focused]) {
        onSelect(items?.[focused]);
        setSearchText('');
      }
    } else if (e.key === 'Escape') {
      setShowPopup(false);

    } else if (items && items.length > 0) {
      if (e.key === 'ArrowDown') {
        setFocused((index) => (index + 1) % items.length);

      } else if (e.key === 'ArrowUp') {
        setFocused((index) =>
          (index - 1 < 0)
            ? items.length - 1
            : (index - 1) % items.length
        );
      }
    }
  }, [items, current, focused]);

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
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {loading && <s.CircleLoader />}
          <s.Select>
            {
              items?.length === 0
                ? <s.SelectItem>No projects found</s.SelectItem>
                // : items?.sort((a, b) => current?.[keyField] === a[keyField] ? -1 : 0)
                : items?.flatMap((item, index) => (
                  [
                    <s.SelectItem key={index}
                      onClick={() => onSelect(item)}
                      focused={focused === index}
                    >
                      <s.Item>
                        {render(item)}
                      </s.Item>
                      <s.ItemActions>
                        {itemActions && itemActions(item, current?.[keyField] === item[keyField])}
                      </s.ItemActions>
                    </s.SelectItem>
                    ,
                    item.divider ? <s.Divider /> : null
                  ].filter(Boolean)
                ))
            }
          </s.Select>
        </s.PopupBody>
      </s.PopupPanel>
    </s.Container>
  );
};

export default ComboBox;