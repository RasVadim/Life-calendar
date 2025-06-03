import React, { useEffect, useState, useRef, useMemo } from 'react';

import {
  getYear,
  getMonth,
  getDate,
  format,
  parseISO,
  getDaysInMonth,
} from 'date-fns';
import type { Locale } from 'date-fns';

import { TItem } from './utils/generateYearItems';
import { WheelPicker } from './WheelPicker';

const DEBOUNCE_TIME = 1500;

export type WheelDatePickerProps = {
  value?: string; // 'yyyy-MM-dd'
  defaultDate?: string; // 'yyyy-MM-dd'
  onChange?: (date: string) => void;
  locale?: Locale;
  yearRange?: number;
  containerHeight?: number;
  itemHeight?: number;
  debounced?: boolean;
};

export const WheelDatePicker: React.FC<WheelDatePickerProps> = ({
  value,
  defaultDate,
  onChange,
  locale,
  yearRange = 120,
  containerHeight = 180,
  itemHeight = 32,
  debounced = false,
}) => {
  // Parse value into draft
  const parsed = value
    ? parseISO(value)
    : defaultDate
      ? parseISO(defaultDate)
      : new Date();

  const [draft, setDraft] = useState({
    year: getYear(parsed),
    month: getMonth(parsed) + 1,
    day: getDate(parsed),
  });

  // TODO: Sync draft with value
  // useEffect(() => {
  //   const parsed = value
  //     ? parseISO(value)
  //     : defaultDate
  //       ? parseISO(defaultDate)
  //       : new Date();
  //   setDraft({
  //     year: getYear(parsed),
  //     month: getMonth(parsed) + 1,
  //     day: getDate(parsed),
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [value, defaultDate]);

  // Generate lists for WheelPicker
  const currentYear = getYear(new Date());
  const yearsRange = useMemo(
    () => Array.from({ length: yearRange }, (_, i) => currentYear - i),
    [currentYear, yearRange],
  );
  const yearItems: TItem[] = useMemo(
    () => yearsRange.map((y) => ({ value: y, label: y.toString() })),
    [yearsRange],
  );
  const monthItems: TItem[] = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: format(new Date(2000, i, 1), 'LLLL', { locale }),
      })),
    [locale],
  );
  const daysInMonth = getDaysInMonth(new Date(draft.year, draft.month - 1, 1));
  const dayItems: TItem[] = useMemo(
    () =>
      Array.from({ length: daysInMonth }, (_, i) => ({
        value: i + 1,
        label: (i + 1).toString(),
      })),
    [draft.year, draft.month, daysInMonth],
  );

  // Debounce ref
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Helper for calling onChange with debounce
  const emitChange = (nextDraft: {
    year: number;
    month: number;
    day: number;
  }) => {
    const daysInTargetMonth = getDaysInMonth(
      new Date(nextDraft.year, nextDraft.month - 1, 1),
    );
    const safeDay =
      nextDraft.day > daysInTargetMonth ? daysInTargetMonth : nextDraft.day;
    const newDate = format(
      new Date(nextDraft.year, nextDraft.month - 1, safeDay),
      'yyyy-MM-dd',
    );
    if (onChange) {
      if (debounced) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          onChange(newDate);
        }, DEBOUNCE_TIME);
      } else {
        onChange(newDate);
      }
    }
  };

  // Change handlers
  const handleYearChange = (val: string | number) => {
    const newYear = Number(val);
    setDraft((prev) => {
      const next = { ...prev, year: newYear };
      emitChange(next);
      return next;
    });
  };
  const handleMonthChange = (val: string | number) => {
    const newMonth = Number(val);
    setDraft((prev) => {
      const next = { ...prev, month: newMonth };
      emitChange(next);
      return next;
    });
  };
  const handleDayChange = (val: string | number) => {
    const newDay = Number(val);
    setDraft((prev) => {
      const next = { ...prev, day: newDay };
      emitChange(next);
      return next;
    });
  };

  // Clear debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <WheelPicker
      yearItems={yearItems}
      yearValue={draft.year}
      onYearChange={handleYearChange}
      monthItems={monthItems}
      monthValue={draft.month}
      onMonthChange={handleMonthChange}
      dayItems={dayItems}
      dayValue={draft.day}
      onDayChange={handleDayChange}
      containerHeight={containerHeight}
      itemHeight={itemHeight}
    />
  );
};
