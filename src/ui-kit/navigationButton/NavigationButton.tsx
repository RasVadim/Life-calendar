import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import cx from 'classnames';

import { TABS } from '@/constants';
import { Button, type TIconName } from '@/ui-kit';

import s from './s.module.styl';

type PropsType = {
  icon: TIconName;
  label?: string;
  to: string;
  position: number;
};

/**
 * A navigation button for the tabBar.
 *
 * It receives a position as a prop, which is used to determine the
 * animation of the label shifting.
 *
 * @prop {string} to - The path to redirect to.
 * @prop {TIconName} icon - The icon to display.
 * @prop {string} label - The label to display.
 * @prop {number} position - The position of the tab in the tabBar.
 *
 * @returns A navigation button as a `Link` component.
 */
export const NavigationButton: FC<PropsType> = ({
  to,
  icon,
  label,
  position,
}) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  const lastTabIndex = TABS.length - 1;
  const isFirstTab = position === 0;
  const isLastTab = position === lastTabIndex;
  const isCenterTab = !isFirstTab && !isLastTab;

  const activeTabPosition = TABS.findIndex((tab) => tab.to === pathname);

  const labelShiftAnimation =
    isLastTab || (activeTabPosition === 0 && isCenterTab)
      ? 'right-start'
      : isCenterTab
      ? 'left-start'
      : undefined;

  return (
    <Link
      to={to}
      className={cx(s.wrap, {
        [s.left]: isFirstTab,
        [s.right]: isLastTab,
      })}
    >
      <Button
        icon={icon}
        label={label}
        active={isActive}
        gost={!isActive}
        hideNonActiveLabel
        labelShiftAnimation={labelShiftAnimation}
      />
    </Link>
  );
};
