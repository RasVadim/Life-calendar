import React from 'react';

import { Avatar, SettingBlock, SettingsGroup } from './components';

import s from './s.module.styl';

export const ProfileSettings: React.FC = () => {
  return (
    <div className={s.wrapper}>
      <Avatar />
      <div className={s.blocks}>
        <SettingsGroup>
          <SettingBlock
            icon="👤"
            title="My Profile"
            circleColor="var(--profile-icon-color)"
            onClick={() => {}}
          />
        </SettingsGroup>
        <SettingsGroup>
          <SettingBlock
            icon="💾"
            title="Data and Storage"
            circleColor="var(--storage-icon-color)"
            onClick={() => {}}
          />
          <SettingBlock
            icon="🎨"
            title="Appearance"
            circleColor="var(--appearance-icon-color)"
            onClick={() => {}}
          />
          <SettingBlock
            icon="🌐"
            title="Language"
            circleColor="var(--language-icon-color)"
            rightText="English"
            onClick={() => {}}
          />
        </SettingsGroup>
        <SettingsGroup>
          <SettingBlock
            icon="⭐"
            title="LC Premium"
            circleColor="var(--premium-icon-color)"
            onClick={() => {}}
          />
        </SettingsGroup>
        <SettingsGroup>
          <SettingBlock
            icon="ℹ️"
            title="LC About"
            circleColor="var(--about-icon-color)"
            onClick={() => {}}
          />
        </SettingsGroup>
      </div>
    </div>
  );
};

SettingBlock.displayName = 'SettingBlock';
