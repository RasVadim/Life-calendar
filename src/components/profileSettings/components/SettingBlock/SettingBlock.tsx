import React from 'react';

import cx from 'classnames';

import s from './s.module.styl';

interface SettingBlockProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  to?: string;
  circleColor?: string; // color of the icon circle
  rightText?: string; // text on the right (e.g. language)
  isFirst?: boolean; // is first in group
  isLast?: boolean; // is last in group
}

export const SettingBlock: React.FC<SettingBlockProps> = ({
  icon,
  title,
  onClick,
  to,
  circleColor = '#3A6BEA', // default blue
  rightText,
  isFirst = false,
  isLast = false,
}) => {
  const blockClass = cx(s.settingBlock, {
    [s.first]: isFirst,
    [s.last]: isLast,
  });

  const content = (
    <>
      <span className={s.iconCircle} style={{ background: circleColor }}>
        <span className={s.icon}>{icon}</span>
      </span>
      <span className={s.title}>{title}</span>
      {rightText && <span className={s.rightText}>{rightText}</span>}
      <span className={s.chevron}>
        {/* SVG chevron icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 6L15 12L9 18"
            stroke="#888"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
    <button className={blockClass} onClick={onClick} type="button">
      {content}
    </button>
  );
};
