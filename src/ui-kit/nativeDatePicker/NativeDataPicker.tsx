import { FC, InputHTMLAttributes } from 'react';

import cx from 'classnames';

import { ISO_DATE_FORMAT } from '@/constants';

import { Button } from '../button/Button';

import s from './s.module.styl';

interface NativeDatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value?: string;
  onChange?: (date: string) => void;
  label?: string;
  placeholder?: string;
  isDefault?: boolean;
  defaultValue?: string;
  confirmButtonLabel?: string;
  confirmButtonVisible?: boolean;
}

/**
 * Native OS Date picker component with customizable label, placeholder, and mobile adaptation.
 *
 * @prop {string} [value] - Selected date value (format ISO_DATE_FORMAT).
 * @prop {function} [onChange] - Callback triggered when the date changes.
 * @prop {string} [label] - Label text above the field.
 * @prop {string} [placeholder=ISO_DATE_FORMAT] - Placeholder for the input field.
 * @prop {boolean} [isDefault=false] - Flag for applying default styles.
 * @prop {string} [defaultValue] - Default value for the input field.
 * @returns {JSX.Element} Date picker element with customization.
 */
export const NativeDatePicker: FC<NativeDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = ISO_DATE_FORMAT,
  isDefault = false,
  defaultValue,
  confirmButtonLabel,
  confirmButtonVisible = false,
  ...rest
}) => {
  const handleConfirm = () => {
    if (defaultValue) {
      onChange?.(defaultValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    onChange?.(newDate);
  };

  return (
    <label className={s.wrap}>
      {label && <div className={s.label}>{label}</div>}
      <input
        type="date"
        value={value || defaultValue || ''}
        onChange={handleChange}
        className={cx(s.input, { [s.inputDefault]: isDefault })}
        placeholder={placeholder}
        {...rest}
      />
      {confirmButtonLabel && (
        <Button
          label={confirmButtonLabel}
          onClick={handleConfirm}
          className={cx(s.confirmButton, {
            [s.confirmButtonHidden]: !confirmButtonVisible,
          })}
        />
      )}
    </label>
  );
};
