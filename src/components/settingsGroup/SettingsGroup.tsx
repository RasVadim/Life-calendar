import React, { FC, ReactElement } from 'react';

import s from './s.module.styl';

// Group wrapper for settings blocks, passes isFirst/isLast only to SettingBlock
export const SettingsGroup: FC<{ children: React.ReactNode }> = ({ children }) => {
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <div className={s.groupBlock}>
      {items.map((child, idx) => {
        if (
          React.isValidElement(child) &&
          (child.type as unknown as { displayName?: string }).displayName === 'SettingBlock'
        ) {
          return React.cloneElement(child as ReactElement, {
            isFirst: idx === 0,
            isLast: idx === items.length - 1,
          });
        }
        return child;
      })}
    </div>
  );
};

SettingsGroup.displayName = 'SettingsGroup';
