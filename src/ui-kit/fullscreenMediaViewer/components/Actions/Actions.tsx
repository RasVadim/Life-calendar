import { FC } from 'react';

import { DeleteIcon, ReplaceIcon } from '@/icons';
import { Button } from '@/ui-kit';

import s from './s.module.styl';

type TProps = {
  onReplaceMedia?: () => void;
  onDeleteMedia?: () => void;
};

export const Actions: FC<TProps> = ({ onReplaceMedia, onDeleteMedia }) => {
  if (!onReplaceMedia && !onDeleteMedia) {
    return null;
  }

  return (
    <div className={s.actionButtons}>
      {onReplaceMedia && (
        <Button
          className={s.actionButton}
          onClick={(e) => {
            e.stopPropagation();
            onReplaceMedia();
          }}
          onlyIcon
          gost
          size="medium"
          icon={<ReplaceIcon />}
        />
      )}
      {onDeleteMedia && (
        <Button
          className={s.actionButton}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteMedia();
          }}
          onlyIcon
          gost
          size="medium"
          icon={<DeleteIcon />}
        />
      )}
    </div>
  );
};
