import { FC } from 'react';

import { TWeekZodiac } from './life';

export enum EThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  EXPEREMENTAL = 'experimental',
  CUSTOM = 'custom',
  FUTURE = 'future',
}

export type TLanguage = 'en' | 'ru' | null;

export enum EZodiacMode {
  CIRCLES = 'circles',
  NATURAL = 'natural',
  OFF = 'off',
}

export type TZodiacIconSet = Record<TWeekZodiac, FC<{ size?: string; color?: string }>>;
