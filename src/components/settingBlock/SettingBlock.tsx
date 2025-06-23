import React from 'react';

import cx from 'classnames';

import { ChevronIcon, CheckIcon } from '@/icons';

import s from './s.module.styl';

interface SettingBlockProps {
  icon?: React.ReactNode;
  title?: string;
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
  expandedPreview?: React.ReactNode;
  carouselItems?: { id: string; content: React.ReactNode | string; selected: boolean }[];
  onCarouselSelect?: (id: string) => void;
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
  expandedPreview,
  carouselItems,
  onCarouselSelect,
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
    [s.expanded]: !!expandedPreview || !!carouselItems,
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
          <CheckIcon />
        ) : (
          <div className={s.emptyIcon} />
        )}
      </span>
    </>
  );
  // If 'to' is provided, render as a link, otherwise as a button
  const mainBlock = to ? (
    <a href={to} className={blockClass}>
      {content}
    </a>
  ) : (
    <button className={blockClass} onClick={onClick} type="button" disabled={disabled}>
      {content}
    </button>
  );

  return (
    <div className={s.settingBlockWrap}>
      {title ? mainBlock : ''}
      {expandedPreview && <div className={s.expandedPreview}>{expandedPreview}</div>}
      {carouselItems && carouselItems.length > 0 && (
        <div className={s.carousel}>
          {carouselItems.map((item, index) => (
            <div
              key={item.id}
              className={cx(s.carouselItem, {
                [s.selected]: item.selected,
                [s.lastCarouselItem]: carouselItems.length - 1 === index,
              })}
              onClick={() => onCarouselSelect && onCarouselSelect(item.id)}
              tabIndex={0}
              role="button"
            >
              {item.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

SettingBlock.displayName = 'SettingBlock';
