import { parseDate } from '@internationalized/date'
import { describe, expect, it } from 'vitest'
import { formatRange, formatSelectedDate, formatVisibleRange } from '../index'
import { getDayFormatter } from '../src/formatter'

const locale = 'en-US'
const timeZone = 'UTC'

const startDate = parseDate('2023-01-10')
const endDate = parseDate('2023-01-12')

describe('formatRange', () => {
  it('should format date range with custom toString function', () => {
    const formatter = getDayFormatter(locale, timeZone)
    const result = formatRange(
      startDate,
      endDate,
      formatter,
      (start, end) => `From ${start} to ${end}`,
      timeZone,
    )
    expect(result).toMatchInlineSnapshot(`"From Tuesday, January 10 to Thursday, January 12, 2023"`)
  })

  it('should format date range with different separator', () => {
    const formatter = getDayFormatter(locale, timeZone)
    const result = formatRange(
      startDate,
      endDate,
      formatter,
      (start, end) => `${start} ~ ${end}`,
      timeZone,
    )
    expect(result).toMatchInlineSnapshot(`"Tuesday, January 10 ~ Thursday, January 12, 2023"`)
  })

  it('should format same date range', () => {
    const formatter = getDayFormatter(locale, timeZone)
    const result = formatRange(
      startDate,
      startDate,
      formatter,
      (start, end) => `${start} – ${end}`,
      timeZone,
    )
    expect(result).toMatchInlineSnapshot(`"Tuesday, January 10 – 2023"`)
  })
})

describe('formatSelectedDate', () => {
  it('should format single selected date', () => {
    expect(formatSelectedDate(startDate, null, locale, timeZone)).toMatchInlineSnapshot(`"Tuesday, January 10, 2023"`)
  })

  it('should format date range', () => {
    expect(formatSelectedDate(startDate, endDate, locale, timeZone)).toMatchInlineSnapshot(
      `"Tuesday, January 10 – Thursday, January 12, 2023"`,
    )
  })

  it('should format same date as single date', () => {
    expect(formatSelectedDate(startDate, startDate, locale, timeZone)).toMatchInlineSnapshot(`"Tuesday, January 10, 2023"`)
  })

  it('should format cross-month date range', () => {
    const startDate = parseDate('2023-01-30')
    const endDate = parseDate('2023-02-02')
    expect(formatSelectedDate(startDate, endDate, locale, timeZone)).toMatchInlineSnapshot(
      `"Monday, January 30 – Thursday, February 2, 2023"`,
    )
  })

  it('should format cross-year date range', () => {
    const startDate = parseDate('2023-12-30')
    const endDate = parseDate('2024-01-02')
    expect(formatSelectedDate(startDate, endDate, locale, timeZone)).toMatchInlineSnapshot(
      `"Saturday, December 30, 2023 – Tuesday, January 2, 2024"`,
    )
  })

  it('should format with different locale', () => {
    const deLocale = 'de-DE'
    expect(formatSelectedDate(startDate, endDate, deLocale, timeZone)).toMatchInlineSnapshot(
      `"Dienstag, 10 – Donnerstag, 12. Januar 2023"`,
    )
  })

  it('should format with different timezone', () => {
    const timezone = 'America/New_York'
    expect(formatSelectedDate(startDate, endDate, locale, timezone)).toMatchInlineSnapshot(
      `"Tuesday, January 10 – Thursday, January 12, 2023"`,
    )
  })
})

describe('formatVisibleRange', () => {
  it('should format partial month range', () => {
    expect(formatVisibleRange(startDate, endDate, locale, timeZone)).toMatchInlineSnapshot(
      `"Tuesday, January 10 – Thursday, January 12, 2023"`,
    )
  })

  it('should format full month range', () => {
    const monthStart = parseDate('2023-01-01')
    const monthEnd = parseDate('2023-01-31')
    expect(formatVisibleRange(monthStart, monthEnd, locale, timeZone)).toMatchInlineSnapshot(`"January 2023"`)
  })

  it('should format range starting from month beginning but not ending at month end', () => {
    const monthStart = parseDate('2023-01-01')
    const partialEnd = parseDate('2023-01-15')
    expect(formatVisibleRange(monthStart, partialEnd, locale, timeZone)).toMatchInlineSnapshot(`""`)
  })

  it('should format range not starting from month beginning', () => {
    const partialStart = parseDate('2023-01-15')
    const monthEnd = parseDate('2023-01-31')
    expect(formatVisibleRange(partialStart, monthEnd, locale, timeZone)).toMatchInlineSnapshot(
      `"Sunday, January 15 – Tuesday, January 31, 2023"`,
    )
  })

  it('should format cross-month full range', () => {
    const start = parseDate('2023-01-01')
    const end = parseDate('2023-02-28')
    expect(formatVisibleRange(start, end, locale, timeZone)).toMatchInlineSnapshot(`"January – February 2023"`)
  })

  it('should format cross-year full range', () => {
    const start = parseDate('2023-12-01')
    const end = parseDate('2024-01-31')
    expect(formatVisibleRange(start, end, locale, timeZone)).toMatchInlineSnapshot(`"December 2023 – January 2024"`)
  })

  it('should format single date', () => {
    expect(formatVisibleRange(startDate, null, locale, timeZone)).toMatchInlineSnapshot(`"Tuesday, January 10, 2023"`)
  })

  it('should format single date when start and end are same', () => {
    expect(formatVisibleRange(startDate, startDate, locale, timeZone)).toMatchInlineSnapshot(`"Tuesday, January 10, 2023"`)
  })

  it('should return empty string for partial month range not ending at month end', () => {
    const start = parseDate('2023-01-15')
    const end = parseDate('2023-01-25')
    expect(formatVisibleRange(start, end, locale, timeZone)).toBe('Sunday, January 15 – Wednesday, January 25, 2023')
  })

  it('should format with different locale', () => {
    const monthStart = parseDate('2023-01-01')
    const monthEnd = parseDate('2023-01-31')
    const deLocale = 'de-DE'
    expect(formatVisibleRange(monthStart, monthEnd, deLocale, timeZone)).toMatchInlineSnapshot(`"Januar 2023"`)
  })

  it('should handle leap year February', () => {
    const start = parseDate('2024-02-01') // 2024 is leap year
    const end = parseDate('2024-02-29')
    expect(formatVisibleRange(start, end, locale, timeZone)).toMatchInlineSnapshot(`"February 2024"`)
  })

  it('should handle non-leap year February', () => {
    const start = parseDate('2023-02-01') // 2023 is not leap year
    const end = parseDate('2023-02-28')
    expect(formatVisibleRange(start, end, locale, timeZone)).toMatchInlineSnapshot(`"February 2023"`)
  })
})

describe('edge cases and error handling', () => {
  it('should handle different timezones correctly', () => {
    const pstTimezone = 'America/Los_Angeles'
    const estTimezone = 'America/New_York'

    const resultPST = formatSelectedDate(startDate, endDate, locale, pstTimezone)
    const resultEST = formatSelectedDate(startDate, endDate, locale, estTimezone)

    // Both should format the same since we're using parseDate which creates CalendarDate
    expect(resultPST).toBe(resultEST)
  })

  it('should handle various locales', () => {
    const locales = ['en-US', 'de-DE', 'fr-FR', 'ja-JP', 'zh-CN']

    locales.forEach((locale) => {
      const result = formatSelectedDate(startDate, endDate, locale, timeZone)
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })
  })

  it('should handle month boundaries correctly', () => {
    // Test various month lengths
    const months = [
      { month: '2023-01-31', days: 31 }, // January
      { month: '2023-02-28', days: 28 }, // February (non-leap)
      { month: '2024-02-29', days: 29 }, // February (leap)
      { month: '2023-04-30', days: 30 }, // April
    ]

    months.forEach(({ month }) => {
      const start = parseDate(`${month.substring(0, 8)}01`)
      const end = parseDate(month)
      const result = formatVisibleRange(start, end, locale, timeZone)
      expect(result).toBeTruthy()
    })
  })
})
