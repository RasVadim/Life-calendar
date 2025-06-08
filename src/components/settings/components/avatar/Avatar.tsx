import React from 'react';

import s from './s.module.styl';

export const Avatar: React.FC = () => {
  // Заглушки
  const name = 'Vadim Rasstrigin';
  const email = 'vadim@example.com';
  const avatarUrl = '';

  return (
    <div className={s.avatarWrap}>
      <div className={s.avatarCircle}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className={s.avatarImg} />
        ) : (
          <span className={s.avatarStub}>{name[0]}</span>
        )}
      </div>
      <div className={s.avatarInfo}>
        <div className={s.avatarName}>{name}</div>
        <div className={s.avatarEmail}>{email}</div>
      </div>
    </div>
  );
};
