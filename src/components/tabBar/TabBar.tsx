import { FC } from 'react';

import cx from 'classnames';

import { PATHS, TABS } from '@/constants';
import { useTranslation } from '@/hooks';
import { NavigationButton } from '@/ui-kit';

import s from './s.module.styl';

type TProps = {
  preview?: boolean;
};

/**
 * A bottom tab bar with navigation buttons.
 * This component renders a bottom tab bar with navigation buttons.
 *
 * @returns A bottom tab bar with navigation buttons.
 */
export const TabBar: FC<TProps> = ({ preview = false }) => {
  const { t } = useTranslation();

  return (
    <div className={cx(s.container, { [s.preview]: preview })}>
      <div className={s.tabBar}>
        {TABS.map(({ icon, label, to }, index) => {
          if (preview)
            return (
              <NavigationButton
                key={to}
                icon={icon}
                label={t(`layout.${label}`)}
                to={to}
                position={index}
                pathName={PATHS.MAIN}
              />
            );
          return (
            <NavigationButton
              key={to}
              icon={icon}
              label={t(`layout.${label}`)}
              to={to}
              position={index}
            />
          );
        })}
      </div>
    </div>
  );
};
