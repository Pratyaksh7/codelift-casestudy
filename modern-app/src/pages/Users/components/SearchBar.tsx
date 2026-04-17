import { useEffect, useRef, useState, type KeyboardEvent, type ChangeEvent } from 'react';

type Props = {
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  debounceMs?: number;
  instant?: boolean;
  width?: number | string;
  disabled?: boolean;
};

export function SearchBar(props: Props) {
  const {
    placeholder = 'Search...',
    defaultValue = '',
    onChange,
    onSubmit,
    debounceMs = 300,
    instant = false,
    width = 280,
    disabled,
  } = props;

  const [value, setValue] = useState<string>(defaultValue);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const fireDebounced = (val: string): void => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      onChange?.(val);
    }, debounceMs);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    setValue(val);
    if (instant) {
      onChange?.(val);
    } else {
      fireDebounced(val);
    }
  };

  const handleClear = (): void => {
    setValue('');
    onChange?.('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(value);
    }
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="users__search" style={{ width }}>
      <input
        type="text"
        className="users__search-input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      {value && (
        <button
          type="button"
          className="users__search-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          &times;
        </button>
      )}
    </div>
  );
}

export default SearchBar;
