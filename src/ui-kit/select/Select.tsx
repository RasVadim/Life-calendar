import React, { FC, useEffect, useRef, useState } from 'react';

import cx from 'classnames';

import s from './s.module.styl';

export type TOption = {
  value: string;
  label: string;
};

type TProps = {
  options: TOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isDisabledStyle?: boolean;
  className?: string;
  onFocus?: () => void;
};

export const Select: FC<TProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  isDisabledStyle,
  className,
  onFocus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || { label: placeholder || '' };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = options.findIndex((opt) => opt.value === value);
          const nextIndex = (currentIndex + 1) % options.length;
          onChange(options[nextIndex].value);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = options.findIndex((opt) => opt.value === value);
          const prevIndex = (currentIndex - 1 + options.length) % options.length;
          onChange(options[prevIndex].value);
        }
        break;
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={cx(s.wrapper, className, {
        [s.open]: isOpen,
        [s.disabled]: disabled || isDisabledStyle,
      })}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls="select-options"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      onFocus={onFocus}
    >
      <div className={s.selected} onClick={() => !disabled && setIsOpen(!isOpen)}>
        <span>{selectedOption.label}</span>
        <div className={s.arrow} />
      </div>

      {isOpen && (
        <div className={s.options} role="listbox" id="select-options">
          {options.map((option) => (
            <div
              key={option.value}
              className={cx(s.option, {
                [s.selected]: option.value === value,
              })}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
