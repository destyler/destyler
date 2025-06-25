import { parseDate } from '@internationalized/date'
import { describe, expect, it } from 'vitest'
import {
  getEndDate,
  isDateDisabled,
  isDateEqual,
  isDateInvalid,
  isDateOutsideVisibleRange,
  isDateUnavailable,
  isNextVisibleRangeInvalid,
  isPreviousVisibleRangeInvalid,
} from '../index'

const duration = { months: 1 }

const min = parseDate('2023-01-01')
const max = parseDate('2023-12-31')

describe('date utilities / Assertion', () => {
  it('isEqual / truthy', () => {
    const dateA = parseDate('2024-03-15')
    const dateB = parseDate('2024-03-15')
    expect(isDateEqual(dateA, dateB)).toBe(true)
  })

  it('isEqual / falsy', () => {
    const dateA = parseDate('2024-04-15')
    const dateB = parseDate('2024-03-15')
    expect(isDateEqual(dateA, dateB)).toBe(false)
  })

  it('isEqual / nullish', () => {
    const dateA = parseDate('2024-04-15')
    expect(isDateEqual(dateA, null)).toBe(false)
  })

  it('isDisabled / truthy', () => {
    const date = parseDate('2024-04-15')

    const startDate = parseDate('2024-04-01')
    const endDate = getEndDate(startDate, duration)

    expect(isDateDisabled(date, startDate, endDate, min, max)).toBe(true)
  })

  it('isDisabled / falsy', () => {
    const date = parseDate('2023-04-15')

    const startDate = parseDate('2023-04-01')
    const endDate = getEndDate(startDate, duration)

    expect(isDateDisabled(date, startDate, endDate, min, max)).toBe(false)
  })

  describe('isDateInvalid', () => {
    it('should return false when date is within valid range', () => {
      const date = parseDate('2023-06-15')
      expect(isDateInvalid(date, min, max)).toBe(false)
    })

    it('should return true when date is before minValue', () => {
      const date = parseDate('2022-12-31')
      expect(isDateInvalid(date, min, max)).toBe(true)
    })

    it('should return true when date is after maxValue', () => {
      const date = parseDate('2024-01-01')
      expect(isDateInvalid(date, min, max)).toBe(true)
    })

    it('should return false when minValue is null', () => {
      const date = parseDate('2022-12-31')
      expect(isDateInvalid(date, null, max)).toBe(false)
    })

    it('should return false when maxValue is null', () => {
      const date = parseDate('2024-01-01')
      expect(isDateInvalid(date, min, null)).toBe(false)
    })

    it('should return false when both minValue and maxValue are null', () => {
      const date = parseDate('2024-01-01')
      expect(isDateInvalid(date, null, null)).toBe(false)
    })

    it('should return false when date equals minValue', () => {
      expect(isDateInvalid(min, min, max)).toBe(false)
    })

    it('should return false when date equals maxValue', () => {
      expect(isDateInvalid(max, min, max)).toBe(false)
    })
  })

  describe('isDateUnavailable', () => {
    const locale = 'en-US'

    it('should return false when date is null', () => {
      expect(isDateUnavailable(null, undefined, locale, min, max)).toBe(false)
    })

    it('should return true when isUnavailable function returns true', () => {
      const date = parseDate('2023-06-15')
      const isUnavailable = () => true
      expect(isDateUnavailable(date, isUnavailable, locale, min, max)).toBe(true)
    })

    it('should return false when isUnavailable function returns false and date is valid', () => {
      const date = parseDate('2023-06-15')
      const isUnavailable = () => false
      expect(isDateUnavailable(date, isUnavailable, locale, min, max)).toBe(false)
    })

    it('should return true when date is invalid even if isUnavailable is undefined', () => {
      const date = parseDate('2024-01-01')
      expect(isDateUnavailable(date, undefined, locale, min, max)).toBe(true)
    })

    it('should return false when date is valid and isUnavailable is undefined', () => {
      const date = parseDate('2023-06-15')
      expect(isDateUnavailable(date, undefined, locale, min, max)).toBe(false)
    })

    it('should pass correct parameters to isUnavailable function', () => {
      const date = parseDate('2023-06-15')
      let receivedDate, receivedLocale
      const isUnavailable = (d: any, l: string) => {
        receivedDate = d
        receivedLocale = l
        return false
      }
      isDateUnavailable(date, isUnavailable, locale, min, max)
      expect(receivedDate).toBe(date)
      expect(receivedLocale).toBe(locale)
    })
  })

  describe('isDateOutsideVisibleRange', () => {
    const startDate = parseDate('2023-04-01')
    const endDate = parseDate('2023-04-30')

    it('should return false when date is within visible range', () => {
      const date = parseDate('2023-04-15')
      expect(isDateOutsideVisibleRange(date, startDate, endDate)).toBe(false)
    })

    it('should return true when date is before start date', () => {
      const date = parseDate('2023-03-31')
      expect(isDateOutsideVisibleRange(date, startDate, endDate)).toBe(true)
    })

    it('should return true when date is after end date', () => {
      const date = parseDate('2023-05-01')
      expect(isDateOutsideVisibleRange(date, startDate, endDate)).toBe(true)
    })

    it('should return false when date equals start date', () => {
      expect(isDateOutsideVisibleRange(startDate, startDate, endDate)).toBe(false)
    })

    it('should return false when date equals end date', () => {
      expect(isDateOutsideVisibleRange(endDate, startDate, endDate)).toBe(false)
    })
  })

  describe('isPreviousVisibleRangeInvalid', () => {
    it('should return true when previous date is invalid (before minValue)', () => {
      const startDate = parseDate('2023-01-01') // 使用 minValue 本身，这样前一天就会无效
      expect(isPreviousVisibleRangeInvalid(startDate, min, max)).toBe(true)
    })

    it('should return false when previous date is valid', () => {
      const startDate = parseDate('2023-06-15')
      expect(isPreviousVisibleRangeInvalid(startDate, min, max)).toBe(false)
    })

    it('should return false when minValue is null', () => {
      const startDate = parseDate('2023-01-02')
      expect(isPreviousVisibleRangeInvalid(startDate, null, max)).toBe(false)
    })

    it('should return false when both min and max are null', () => {
      const startDate = parseDate('2023-01-02')
      expect(isPreviousVisibleRangeInvalid(startDate, null, null)).toBe(false)
    })
  })

  describe('isNextVisibleRangeInvalid', () => {
    it('should return true when next date is invalid (after maxValue)', () => {
      const endDate = parseDate('2023-12-31') // 使用 maxValue 本身，这样后一天就会无效
      expect(isNextVisibleRangeInvalid(endDate, min, max)).toBe(true)
    })

    it('should return false when next date is valid', () => {
      const endDate = parseDate('2023-06-15')
      expect(isNextVisibleRangeInvalid(endDate, min, max)).toBe(false)
    })

    it('should return false when maxValue is null', () => {
      const endDate = parseDate('2023-12-30')
      expect(isNextVisibleRangeInvalid(endDate, min, null)).toBe(false)
    })

    it('should return false when both min and max are null', () => {
      const endDate = parseDate('2023-12-30')
      expect(isNextVisibleRangeInvalid(endDate, null, null)).toBe(false)
    })
  })

  describe('isDateDisabled - extended tests', () => {
    it('should return true when date is before visible range', () => {
      const date = parseDate('2023-03-15')
      const startDate = parseDate('2023-04-01')
      const endDate = getEndDate(startDate, duration)

      expect(isDateDisabled(date, startDate, endDate, min, max)).toBe(true)
    })

    it('should return true when date is after visible range', () => {
      const date = parseDate('2023-05-15')
      const startDate = parseDate('2023-04-01')
      const endDate = getEndDate(startDate, duration)

      expect(isDateDisabled(date, startDate, endDate, min, max)).toBe(true)
    })

    it('should return true when date is before minValue', () => {
      const date = parseDate('2022-12-31')
      const startDate = parseDate('2022-12-01')
      const endDate = getEndDate(startDate, duration)

      expect(isDateDisabled(date, startDate, endDate, min, max)).toBe(true)
    })

    it('should return true when date is after maxValue', () => {
      const date = parseDate('2024-01-01')
      const startDate = parseDate('2024-01-01')
      const endDate = getEndDate(startDate, duration)

      expect(isDateDisabled(date, startDate, endDate, min, max)).toBe(true)
    })
  })

  describe('isDateEqual - extended tests', () => {
    it('should return false when dateB is undefined', () => {
      const dateA = parseDate('2024-03-15')
      expect(isDateEqual(dateA, undefined)).toBe(false)
    })

    it('should return true for same date objects', () => {
      const date = parseDate('2024-03-15')
      expect(isDateEqual(date, date)).toBe(true)
    })

    it('should return false for dates with different years', () => {
      const dateA = parseDate('2024-03-15')
      const dateB = parseDate('2023-03-15')
      expect(isDateEqual(dateA, dateB)).toBe(false)
    })

    it('should return false for dates with different months', () => {
      const dateA = parseDate('2024-03-15')
      const dateB = parseDate('2024-04-15')
      expect(isDateEqual(dateA, dateB)).toBe(false)
    })

    it('should return false for dates with different days', () => {
      const dateA = parseDate('2024-03-15')
      const dateB = parseDate('2024-03-16')
      expect(isDateEqual(dateA, dateB)).toBe(false)
    })
  })
})
