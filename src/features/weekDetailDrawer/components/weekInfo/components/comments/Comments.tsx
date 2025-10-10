import { FC } from 'react';

import { useTranslation } from '@/hooks';

import s from './s.module.styl';

type TCommentsProps = {
  comments?: string | null;
};

export const Comments: FC<TCommentsProps> = ({ comments }) => {
  const { t } = useTranslation();

  if (!comments) return null;

  return (
    <div className={s.comments}>
      <div className={s.commentsLabel}>{t('layout.comments')}:</div>
      <div className={s.commentsText}>{comments}</div>
    </div>
  );
};
