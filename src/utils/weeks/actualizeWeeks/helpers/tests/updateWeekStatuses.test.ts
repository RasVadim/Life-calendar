import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { IWeek, updateDBWeek } from '@/store/clientDB';
import { EWeekType, ESeason, EDayOfWeek } from '@/types/life';

import { updateWeekStatuses } from '../updateWeekStatuses';

// Mock the database function
vi.mock('@/store/clientDB', () => ({
  updateDBWeek: vi.fn(),
}));

// Mock the getWeekType function
vi.mock('@/utils', () => ({
  getWeekType: vi.fn(),
}));

describe('updateWeekStatuses', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createMockWeek = (
    id: string,
    dateStart: string,
    dateEnd: string,
    type: EWeekType,
  ): IWeek => ({
    id,
    dateStart,
    dateEnd,
    type,
    month: '3',
    secondMonth: null,
    season: ESeason.Spring,
    secondSeason: null,
    year: '2024',
    secondYear: null,
    lifeYear: 35,
    secondLifeYear: null,
    lifeMonth: 3,
    isLeapYear: true,
    media: null,
    holidays: null,
    yearZodiacLabel: null,
    comments: null,
    description: null,
    days: [
      {
        id: 'day1',
        date: dateStart,
        dayOfWeek: EDayOfWeek.Monday,
        isWeekPreview: false,
        holidays: null,
        lifeDay: 1,
        comments: null,
        description: null,
      },
    ],
  });

  const mockWeeks: IWeek[] = [
    createMockWeek('week1', '2024-03-01', '2024-03-07', EWeekType.Past),
    createMockWeek('week2', '2024-03-08', '2024-03-14', EWeekType.Present),
    createMockWeek('week3', '2024-03-15', '2024-03-21', EWeekType.Future),
    createMockWeek('week4', '2024-03-22', '2024-03-28', EWeekType.Future),
  ];

  describe('when no weeks to update', () => {
    it('should return early when toUpdate array is empty', async () => {
      const currentDate = new Date('2024-03-10T12:00:00.000Z');

      await updateWeekStatuses(mockWeeks, 10, 15, currentDate);

      expect(updateDBWeek).not.toHaveBeenCalled();
    });

    it('should return early when fromIndex is greater than toIndex', async () => {
      const currentDate = new Date('2024-03-10T12:00:00.000Z');

      await updateWeekStatuses(mockWeeks, 3, 1, currentDate);

      expect(updateDBWeek).not.toHaveBeenCalled();
    });
  });

  describe('when weeks need status updates', () => {
    it('should update weeks that have changed status', async () => {
      const currentDate = new Date('2024-03-10T12:00:00.000Z');

      // Mock getWeekType to return different types for some weeks
      const { getWeekType } = await import('@/utils');
      vi.mocked(getWeekType)
        .mockReturnValueOnce(EWeekType.Past) // week1 - no change
        .mockReturnValueOnce(EWeekType.Past) // week2 - changed from Present to Past
        .mockReturnValueOnce(EWeekType.Present); // week3 - changed from Future to Present

      await updateWeekStatuses(mockWeeks, 0, 2, currentDate);

      expect(updateDBWeek).toHaveBeenCalledTimes(2);
      expect(updateDBWeek).toHaveBeenCalledWith({
        ...mockWeeks[1],
        type: EWeekType.Past,
      });
      expect(updateDBWeek).toHaveBeenCalledWith({
        ...mockWeeks[2],
        type: EWeekType.Present,
      });
    });

    it('should not update weeks that have not changed status', async () => {
      const currentDate = new Date('2024-03-10T12:00:00.000Z');

      // Mock getWeekType to return same types
      const { getWeekType } = await import('@/utils');
      vi.mocked(getWeekType)
        .mockReturnValueOnce(EWeekType.Past) // week1 - no change
        .mockReturnValueOnce(EWeekType.Present) // week2 - no change
        .mockReturnValueOnce(EWeekType.Future); // week3 - no change

      await updateWeekStatuses(mockWeeks, 0, 2, currentDate);

      expect(updateDBWeek).not.toHaveBeenCalled();
    });

    it('should handle single week update', async () => {
      const currentDate = new Date('2024-03-10T12:00:00.000Z');

      const { getWeekType } = await import('@/utils');
      vi.mocked(getWeekType).mockReturnValueOnce(EWeekType.Past);

      await updateWeekStatuses(mockWeeks, 1, 1, currentDate);

      expect(updateDBWeek).toHaveBeenCalledTimes(1);
      expect(updateDBWeek).toHaveBeenCalledWith({
        ...mockWeeks[1],
        type: EWeekType.Past,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty weeks array', async () => {
      const currentDate = new Date('2024-03-10T12:00:00.000Z');

      await updateWeekStatuses([], 0, 0, currentDate);

      expect(updateDBWeek).not.toHaveBeenCalled();
    });

    it('should handle negative indices gracefully', async () => {
      const currentDate = new Date('2024-03-10T12:00:00.000Z');

      await updateWeekStatuses(mockWeeks, -1, 0, currentDate);

      expect(updateDBWeek).not.toHaveBeenCalled();
    });

    it('should handle indices beyond array length', async () => {
      const currentDate = new Date('2024-03-10T12:00:00.000Z');

      await updateWeekStatuses(mockWeeks, 0, 100, currentDate);

      // Should process all available weeks
      expect(updateDBWeek).toHaveBeenCalled();
    });

    it('should process all weeks when range covers entire array', async () => {
      const currentDate = new Date('2024-03-10T12:00:00.000Z');

      const { getWeekType } = await import('@/utils');
      vi.mocked(getWeekType)
        .mockReturnValueOnce(EWeekType.Future) // week1: Past -> Future
        .mockReturnValueOnce(EWeekType.Future) // week2: Present -> Future
        .mockReturnValueOnce(EWeekType.Past) // week3: Future -> Past
        .mockReturnValueOnce(EWeekType.Past); // week4: Future -> Past

      await updateWeekStatuses(mockWeeks, 0, mockWeeks.length - 1, currentDate);

      expect(updateDBWeek).toHaveBeenCalledTimes(4);
    });
  });

  describe('parallel updates', () => {
    it('should update all changed weeks in parallel', async () => {
      const currentDate = new Date('2024-03-10T12:00:00.000Z');

      const { getWeekType } = await import('@/utils');
      vi.mocked(getWeekType)
        .mockReturnValueOnce(EWeekType.Future) // week1: Past -> Future
        .mockReturnValueOnce(EWeekType.Future) // week2: Present -> Future
        .mockReturnValueOnce(EWeekType.Past) // week3: Future -> Past
        .mockReturnValueOnce(EWeekType.Past); // week4: Future -> Past

      const startTime = Date.now();
      await updateWeekStatuses(mockWeeks, 0, 3, currentDate);
      const endTime = Date.now();

      // All updates should be called
      expect(updateDBWeek).toHaveBeenCalledTimes(4);

      // Should complete quickly (parallel execution)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('function parameters', () => {
    it('should call getWeekType with correct parameters for each week', async () => {
      const currentDate = new Date('2024-03-10T12:00:00.000Z');

      const { getWeekType } = await import('@/utils');
      vi.mocked(getWeekType).mockReturnValue(EWeekType.Past);

      await updateWeekStatuses(mockWeeks, 0, 1, currentDate);

      expect(getWeekType).toHaveBeenCalledTimes(2);
      expect(getWeekType).toHaveBeenNthCalledWith(1, '2024-03-01', '2024-03-07', currentDate);
      expect(getWeekType).toHaveBeenNthCalledWith(2, '2024-03-08', '2024-03-14', currentDate);
    });

    it('should preserve all week properties except type when updating', async () => {
      const currentDate = new Date('2024-03-10T12:00:00.000Z');

      const { getWeekType } = await import('@/utils');
      vi.mocked(getWeekType).mockReturnValue(EWeekType.Future);

      await updateWeekStatuses(mockWeeks, 0, 0, currentDate);

      const updatedWeek = vi.mocked(updateDBWeek).mock.calls[0][0];

      // All properties should be preserved
      expect(updatedWeek.id).toBe(mockWeeks[0].id);
      expect(updatedWeek.dateStart).toBe(mockWeeks[0].dateStart);
      expect(updatedWeek.dateEnd).toBe(mockWeeks[0].dateEnd);
      expect(updatedWeek.lifeYear).toBe(mockWeeks[0].lifeYear);
      expect(updatedWeek.days).toEqual(mockWeeks[0].days);

      // Only type should be changed
      expect(updatedWeek.type).toBe(EWeekType.Future);
    });
  });
});
