import { describe, it, expect, beforeEach } from 'vitest';

import { TMedia, TMediaDatesMap } from '@/types';

import { setPreviewFlag, setMultiplePreviewFlags } from '../mediaFlags';

describe('setPreviewFlag', () => {
  let media: TMediaDatesMap<TMedia>;

  beforeEach(() => {
    media = {};
  });

  it('should set a single preview flag', () => {
    const weekStart = new Date(2024, 2, 4); // March 4, 2024
    const result = setPreviewFlag(weekStart, media, 'isMonthPreview');

    expect(result).toBe('20240304');
    expect(media['20240304']).toEqual({
      isMonthPreview: true,
    });
  });

  it('should set season preview flag', () => {
    const weekStart = new Date(2024, 5, 15); // June 15, 2024
    const result = setPreviewFlag(weekStart, media, 'isSeasonPreview');

    expect(result).toBe('20240615');
    expect(media['20240615']).toEqual({
      isSeasonPreview: true,
    });
  });

  it('should merge with existing flags', () => {
    const weekStart = new Date(2024, 2, 4);

    // Set first flag
    setPreviewFlag(weekStart, media, 'isMonthPreview');

    // Set second flag
    const result = setPreviewFlag(weekStart, media, 'isSeasonPreview');

    expect(result).toBe('20240304');
    expect(media['20240304']).toEqual({
      isMonthPreview: true,
      isSeasonPreview: true,
    });
  });

  it('should not overwrite existing media properties', () => {
    const weekStart = new Date(2024, 2, 4);

    // Set existing media
    media['20240304'] = {
      url: 'https://example.com/image.jpg',
      isVideo: true,
    };

    // Add preview flag
    const result = setPreviewFlag(weekStart, media, 'isMonthPreview');

    expect(result).toBe('20240304');
    expect(media['20240304']).toEqual({
      url: 'https://example.com/image.jpg',
      isVideo: true,
      isMonthPreview: true,
    });
  });

  it('should handle different dates', () => {
    const date1 = new Date(2024, 0, 1); // January 1
    const date2 = new Date(2024, 11, 31); // December 31

    setPreviewFlag(date1, media, 'isMonthPreview');
    setPreviewFlag(date2, media, 'isSeasonPreview');

    expect(media['20240101']).toEqual({ isMonthPreview: true });
    expect(media['20241231']).toEqual({ isSeasonPreview: true });
  });
});

describe('setMultiplePreviewFlags', () => {
  let media: TMediaDatesMap<TMedia>;

  beforeEach(() => {
    media = {};
  });

  it('should set multiple preview flags', () => {
    const weekStart = new Date(2024, 2, 4);
    const result = setMultiplePreviewFlags(weekStart, media, ['isMonthPreview', 'isSeasonPreview']);

    expect(result).toBe('20240304');
    expect(media['20240304']).toEqual({
      isMonthPreview: true,
      isSeasonPreview: true,
    });
  });

  it('should set single flag from array', () => {
    const weekStart = new Date(2024, 2, 4);
    const result = setMultiplePreviewFlags(weekStart, media, ['isMonthPreview']);

    expect(result).toBe('20240304');
    expect(media['20240304']).toEqual({
      isMonthPreview: true,
    });
  });

  it('should merge with existing flags', () => {
    const weekStart = new Date(2024, 2, 4);

    // Set existing flag
    setPreviewFlag(weekStart, media, 'isMonthPreview');

    // Add multiple flags
    const result = setMultiplePreviewFlags(weekStart, media, ['isSeasonPreview']);

    expect(result).toBe('20240304');
    expect(media['20240304']).toEqual({
      isMonthPreview: true,
      isSeasonPreview: true,
    });
  });

  it('should not overwrite existing media properties', () => {
    const weekStart = new Date(2024, 2, 4);

    // Set existing media
    media['20240304'] = {
      url: 'https://example.com/video.mp4',
      isVideo: true,
      source: 'Instagram',
    };

    // Add multiple flags
    const result = setMultiplePreviewFlags(weekStart, media, ['isMonthPreview', 'isSeasonPreview']);

    expect(result).toBe('20240304');
    expect(media['20240304']).toEqual({
      url: 'https://example.com/video.mp4',
      isVideo: true,
      source: 'Instagram',
      isMonthPreview: true,
      isSeasonPreview: true,
    });
  });

  it('should handle empty array', () => {
    const weekStart = new Date(2024, 2, 4);
    const result = setMultiplePreviewFlags(weekStart, media, []);

    expect(result).toBe('20240304');
    expect(media['20240304']).toEqual({});
  });

  it('should handle duplicate flags in array', () => {
    const weekStart = new Date(2024, 2, 4);
    const result = setMultiplePreviewFlags(weekStart, media, ['isMonthPreview', 'isMonthPreview']);

    expect(result).toBe('20240304');
    expect(media['20240304']).toEqual({
      isMonthPreview: true,
    });
  });

  it('should handle different dates', () => {
    const date1 = new Date(2024, 0, 1); // January 1
    const date2 = new Date(2024, 11, 31); // December 31

    setMultiplePreviewFlags(date1, media, ['isMonthPreview']);
    setMultiplePreviewFlags(date2, media, ['isSeasonPreview']);

    expect(media['20240101']).toEqual({ isMonthPreview: true });
    expect(media['20241231']).toEqual({ isSeasonPreview: true });
  });
});
