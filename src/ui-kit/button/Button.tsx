import { FC, memo, ReactElement } from 'react';

import cx from 'classnames';

import { BUTTON_ICONS, type TIconName } from './buttonIcons';

import s from './s.module.styl';

type PropsType = {
  onClick?: () => void;
  icon?: TIconName | ReactElement;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  active?: boolean;
  disabled?: boolean;
  gost?: boolean;
  selected?: boolean;
  hideNonActiveLabel?: boolean;
  labelShiftAnimation?: 'right-start' | 'left-start';
  onlyIcon?: boolean;
  className?: string;
  link?: boolean;
};

/**
 * A customizable button component that supports icons, labels, and optional animations.
 *
 * @prop {function} [onClick] - Callback function triggered when the button is clicked.
 * @prop {TIconName | ReactElement} [icon] - Icon to display on the button. Can be either a predefined icon name or a React element.
 * @prop {string} [label] - Text label to display on the button.
 * @prop {'small' | 'medium' | 'large'} [size='medium'] - Size of the button.
 * @prop {boolean} [active=false] - Determines if the button is in the active state.
 * @prop {boolean} [disabled=false] - If true, the button will be disabled.
 * @prop {boolean} [gost=false] - If true, the button will be styled as a "ghost" button.
 * @prop {boolean} [selected=false] - If true, the button will be styled as a selected button.
 * @prop {boolean} [hideNonActiveLabel=false] - If true, the label will be hidden when the button is not active.
 * @prop {'right-start' | 'left-start'} [labelShiftAnimation] - Determines the animation direction for the label.
 * @prop {boolean} [onlyIcon=false] - If true, the button will be rendered as a circular icon button without label.
 * @prop {string} [className] - Additional CSS classes to apply to the button.
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
    onlyIcon = false,
    selected = false,
    className,
    link,
  }) => {
    let iconElement: ReactElement | null = null;

    if (typeof icon === 'string') {
      const IconComponent = BUTTON_ICONS[icon];
      iconElement = IconComponent ? <IconComponent isActive={active} /> : null;
    } else if (icon) {
      iconElement = icon;
    }

    const labelClasses = cx(s.label, {
      [s.hidden]: hideNonActiveLabel && !active,
      [s.activeLabel]: active,
    });

    return (
      <button
        className={cx(s.button, className, {
          [s.active]: active,
          [s.disabled]: disabled,
          [s.gost]: gost,
          [s.customIcon]: icon && typeof icon !== 'string',
          [s.small]: size === 'small',
          [s.large]: size === 'large',
          [s.labelShiftAnimation]: labelShiftAnimation,
          [s.onlyIcon]: onlyIcon,
          [s.selected]: selected,
          [s.link]: link,
        })}
        onClick={onClick}
        disabled={disabled}
      >
        {labelShiftAnimation ? (
          <div
            className={cx(s.contentWrapper, {
              [s.rightWrapper]: labelShiftAnimation === 'right-start' && !active,
              [s.leftWrapper]: labelShiftAnimation === 'right-start' && active,
            })}
          >
            {iconElement}
            {label && !onlyIcon && (
              <>
                <p className={labelClasses}>{label}</p>
                <p className={s.hiddenLabel}>{label}</p>
              </>
            )}
          </div>
        ) : (
          <>
            {iconElement}
            {label && !onlyIcon && <p className={labelClasses}>{label}</p>}
          </>
        )}
      </button>
    );
  },
);
