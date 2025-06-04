import React from 'react';

import s from './s.module.styl';

interface SettingBlockProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  to?: string;
}

export const SettingBlock: React.FC<SettingBlockProps> = ({
  icon,
  title,
  onClick,
  to,
}) => {
  // Если есть to, рендерим как ссылку, иначе как кнопку
  if (to) {
    return (
      <a href={to} className={s.settingBlock}>
        <span className={s.icon}>{icon}</span>
        <span className={s.title}>{title}</span>
      </a>
    );
  }
  return (
    <button className={s.settingBlock} onClick={onClick} type="button">
      <span className={s.icon}>{icon}</span>
      <span className={s.title}>{title}</span>
    </button>
  );
};
