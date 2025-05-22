import { FC, InputHTMLAttributes } from 'react';

import cx from 'classnames';

import s from './s.module.styl';

interface DataPickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  isDefault?: boolean;
}

/**
 * Date picker component with customizable label, placeholder, and mobile adaptation.
 *
 * @prop {string} value - Selected date value (format YYYY-MM-DD).
 * @prop {function} onChange - Callback triggered when the date changes.
 * @prop {string} [label] - Label text above the field.
 * @prop {string} [placeholder='YYYY-MM-DD'] - Placeholder for the input field.
 * @prop {boolean} [isDefault=false] - Flag for applying default styles.
 * @returns {JSX.Element} Date picker element with customization.
 */
export const DataPicker: FC<DataPickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'YYYY-MM-DD',
  isDefault = false,
  ...rest
}) => {
  return (
    <label className={s.wrap}>
      {label && <div className={s.label}>{label}</div>}
      <input
        type="date"
        value={value}
        onChange={onChange}
        className={cx(s.input, { [s.inputDefault]: isDefault })}
        placeholder={placeholder}
        {...rest}
      />
    </label>
  );
};
