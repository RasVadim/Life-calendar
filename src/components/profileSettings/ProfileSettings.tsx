import React from 'react';

import { Avatar, Divider, SettingBlock } from './components';

import s from './s.module.styl';

export const ProfileSettings: React.FC = () => {
  return (
    <div className={s.wrapper}>
      <Avatar />
      <div className={s.blocks}>
        <SettingBlock icon="👤" title="My Profile" onClick={() => {}} />
        <Divider />
        <SettingBlock icon="💾" title="Data and Storage" onClick={() => {}} />
        <SettingBlock icon="🎨" title="Appearance" onClick={() => {}} />
        <SettingBlock icon="🌐" title="Language" onClick={() => {}} />
        <Divider />
        <SettingBlock icon="⭐" title="LC Premium" onClick={() => {}} />
        <Divider />
        <SettingBlock icon="ℹ️" title="LC About" onClick={() => {}} />
      </div>
    </div>
  );
};
