import React, { FC } from 'react';

import cx from 'classnames';

import { Header, TabBar } from '@/components';
import { getBGColor, getBorderColor } from '@/components/lifeCalendar/components/week/utils';
import { useDBWeeks } from '@/store/clientDB';
import { EWeekType } from '@/types/life';

import s from './s.module.styl';

export const ThemePreview: FC = () => {
  const weeks = useDBWeeks();

  // Get current year
  const now = new Date();
  const currentYear = now.getFullYear();
  // Always take 2 years before and 2 years after current year
  const yearsRange: number[] = [];
  for (let i = -2; i <= 2; i++) {
    yearsRange.push(currentYear + i);
  }

  // Find all birthday weeks
  const birthdayWeeks = weeks
    .map((w, idx) => ({ ...w, idx }))
    .filter((w) => w.holidays && w.holidays.includes('birthday'));

  if (birthdayWeeks.length === 0) {
    return (
      <div className={s.wrapper}>
        <Header preview />
        <div className={s.smallLifeGrid}>No birthday weeks found</div>
        <TabBar preview />
      </div>
    );
  }

  // Find the closest past or current birthday week to now
  const pastOrCurrentBirthdays = birthdayWeeks.filter((w) => new Date(w.dateStart) <= now);
  const closestBirthdayWeek = pastOrCurrentBirthdays.length
    ? pastOrCurrentBirthdays.reduce((prev, curr) => {
        const prevDate = new Date(prev.dateStart);
        const currDate = new Date(curr.dateStart);
        return currDate > prevDate ? curr : prev;
      })
    : birthdayWeeks[0]; // if all birthdays are in the future

  const centerIdx = closestBirthdayWeek.idx;
  // Take 2 years before, current, 2 years after (5*52 weeks)
  const startIdx = Math.max(0, centerIdx - 2 * 52);
  const endIdx = Math.min(weeks.length, centerIdx + 3 * 52); // +3*52 to include current and 2 after
  const closiest5YearsBirthday = weeks.slice(startIdx, endIdx);

  return (
    <div className={s.wrapper}>
      <Header preview />
      <div className={s.smallLifeGrid}>
        {closiest5YearsBirthday.map((week) => {
          const bGColor = getBGColor(week.holidays);
          const borderColor = getBorderColor(week.type);
          const isPresent = week.type === EWeekType.Present;
          return (
            <div
              key={week.id}
              id={week.id}
              className={cx(s.week, { [s.present]: isPresent })}
              style={{ backgroundColor: bGColor, borderColor: borderColor }}
            />
          );
        })}
      </div>
      <TabBar preview />
    </div>
  );
};
