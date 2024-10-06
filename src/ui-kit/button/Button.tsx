import { FC, cloneElement, memo } from 'react';
import cx from 'classnames';

import { BUTTON_ICONS, type TIconName } from './buttonIcons';

import s from './s.module.styl';

type PropsType = {
  onClick?: () => void;
  icon?: TIconName;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  active?: boolean;
  disabled?: boolean;
  gost?: boolean;
  hideNonActiveLabel?: boolean;
  labelShiftAnimation?: 'right-start' | 'left-start';
};

/**
 * A customizable button component that supports icons, labels, and optional animations.
 *
 * @prop {function} [onClick] - Callback function triggered when the button is clicked.
 * @prop {TIconName} [icon] - Icon to display on the button.
 * @prop {string} [label] - Text label to display on the button.
 * @prop {'small' | 'medium' | 'large'} [size='medium'] - Size of the button.
 * @prop {boolean} [active=false] - Determines if the button is in the active state.
 * @prop {boolean} [disabled=false] - If true, the button will be disabled.
 * @prop {boolean} [gost=false] - If true, the button will be styled as a "ghost" button.
 * @prop {boolean} [hideNonActiveLabel=false] - If true, the label will be hidden when the button is not active.
 * @prop {'right-start' | 'left-start'} [labelShiftAnimation] - Determines the animation direction for the label.
 *
 * @returns {JSX.Element} A button component with an optional icon, label, and animation.
 */
export const Button: FC<PropsType> = memo(
  ({
    onClick,
    icon,
    label,
    size = 'medium',
    active = false,
    disabled = false,
    gost = false,
    hideNonActiveLabel = false,
    labelShiftAnimation = '',
  }) => {
    const buttonIcon = icon && BUTTON_ICONS[icon];

    const iconWithProps = buttonIcon
      ? cloneElement(buttonIcon, { isActive: active })
      : null;

    const labelClasses = cx(s.label, {
      [s.hidden]: hideNonActiveLabel && !active,
      [s.activeLabel]: active,
    });

    return (
      <button
        className={cx(s.button, {
          [s.active]: active,
          [s.disabled]: disabled,
          [s.gost]: gost,
          [s.small]: size === 'small',
          [s.large]: size === 'large',
          [s.labelShiftAnimation]: labelShiftAnimation,
        })}
        onClick={onClick}
      >
        {labelShiftAnimation ? (
          <div
            className={cx(s.contentWrapper, {
              [s.rightWrapper]:
                labelShiftAnimation === 'right-start' && !active,
              [s.leftWrapper]: labelShiftAnimation === 'right-start' && active,
            })}
          >
            {iconWithProps}
            {label && (
              <>
                <p className={labelClasses}>{label}</p>
                <p className={s.hiddenLabel}>{label}</p>
              </>
            )}
          </div>
        ) : (
          <>
            {iconWithProps}
            {label && <p className={labelClasses}>{label}</p>}
          </>
        )}
      </button>
    );
  }
);
