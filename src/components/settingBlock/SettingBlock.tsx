import React from 'react';

import cx from 'classnames';

import { ChevronIcon, CheckIcon } from '@/icons';

import s from './s.module.styl';

interface SettingBlockProps {
  icon?: React.ReactNode;
  title: string;
  onClick?: () => void;
  to?: string;
  circleColor?: string; // color of the icon circle
  rightText?: string; // text on the right (e.g. language)
  isFirst?: boolean; // is first in group
  isLast?: boolean; // is last in group
  disabled?: boolean;
  active?: boolean;
  arrow?: boolean;
  thinText?: boolean;
  lessPadding?: boolean;
}

export const SettingBlock: React.FC<SettingBlockProps> = ({
  icon,
  title,
  onClick,
  to,
  circleColor = 'var(--primary-color)', // default from theme
  rightText,
  isFirst = false,
  isLast = false,
  disabled = false,
  active = false,
  arrow = true,
  thinText = false,
  lessPadding = false,
}) => {
  const blockClass = cx(s.settingBlock, {
    [s.first]: isFirst,
    [s.last]: isLast,
    [s.disabled]: disabled,
    [s.active]: active,
    [s.noArrow]: !arrow,
    [s.noIcon]: !icon,
    [s.thinText]: thinText,
    [s.lessPadding]: lessPadding,
  });

  const content = (
    <>
      {!!icon && (
        <span className={s.iconCircle} style={{ background: circleColor }}>
          <span className={s.icon}>{icon}</span>
        </span>
      )}
      <span className={s.title}>{title}</span>
      <span className={s.rightBlock}>
        {rightText && <span className={s.rightText}>{rightText}</span>}
        {arrow ? (
          <ChevronIcon isActive={active} />
        ) : active ? (
          <CheckIcon isActive />
        ) : (
          <div className={s.emptyIcon} />
        )}
      </span>
    </>
  );
  // If 'to' is provided, render as a link, otherwise as a button
  if (to) {
    return (
      <a href={to} className={blockClass}>
        {content}
      </a>
    );
  }
  return (
    <button className={blockClass} onClick={onClick} type="button" disabled={disabled}>
      {content}
    </button>
  );
};

SettingBlock.displayName = 'SettingBlock';
