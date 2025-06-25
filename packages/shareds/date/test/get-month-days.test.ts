import { CalendarDate } from '@internationalized/date'
import { describe, expect, it } from 'vitest'
import { getMonthDays } from '../index'

describe('getMonthDays', () => {
  it('en / returns the list of month dates', () => {
    const days = getMonthDays(new CalendarDate(2023, 1, 1), 'en')
    const dateStrings = days.map(weeks => weeks.map(date => date?.toString()))
    expect(dateStrings).toMatchInlineSnapshot(`
      [
        [
          "2023-01-01",
          "2023-01-02",
          "2023-01-03",
          "2023-01-04",
          "2023-01-05",
          "2023-01-06",
          "2023-01-07",
        ],
        [
          "2023-01-08",
          "2023-01-09",
          "2023-01-10",
          "2023-01-11",
          "2023-01-12",
          "2023-01-13",
          "2023-01-14",
        ],
        [
          "2023-01-15",
          "2023-01-16",
          "2023-01-17",
          "2023-01-18",
          "2023-01-19",
          "2023-01-20",
          "2023-01-21",
        ],
        [
          "2023-01-22",
          "2023-01-23",
          "2023-01-24",
          "2023-01-25",
          "2023-01-26",
          "2023-01-27",
          "2023-01-28",
        ],
        [
          "2023-01-29",
          "2023-01-30",
          "2023-01-31",
          "2023-02-01",
          "2023-02-02",
          "2023-02-03",
          "2023-02-04",
        ],
      ]
    `)
  })

  it('en / returns correct month dates for custom firstDayOfWeek', () => {
    const days = getMonthDays(new CalendarDate(2023, 10, 1), 'en', undefined, 1)
    const dateStrings = days.map(weeks => weeks.map(date => date?.toString()))
    expect(dateStrings).toMatchInlineSnapshot(`
      [
        [
          "2023-09-25",
          "2023-09-26",
          "2023-09-27",
          "2023-09-28",
          "2023-09-29",
          "2023-09-30",
          "2023-10-01",
        ],
        [
          "2023-10-02",
          "2023-10-03",
          "2023-10-04",
          "2023-10-05",
          "2023-10-06",
          "2023-10-07",
          "2023-10-08",
        ],
        [
          "2023-10-09",
          "2023-10-10",
          "2023-10-11",
          "2023-10-12",
          "2023-10-13",
          "2023-10-14",
          "2023-10-15",
        ],
        [
          "2023-10-16",
          "2023-10-17",
          "2023-10-18",
          "2023-10-19",
          "2023-10-20",
          "2023-10-21",
          "2023-10-22",
        ],
        [
          "2023-10-23",
          "2023-10-24",
          "2023-10-25",
          "2023-10-26",
          "2023-10-27",
          "2023-10-28",
          "2023-10-29",
        ],
        [
          "2023-10-30",
          "2023-10-31",
          "2023-11-01",
          "2023-11-02",
          "2023-11-03",
          "2023-11-04",
          "2023-11-05",
        ],
      ]
    `)
  })

  it('handles February in leap year', () => {
    const days = getMonthDays(new CalendarDate(2024, 2, 1), 'en')
    const dateStrings = days.map(weeks => weeks.map(date => date?.toString()))
    expect(dateStrings).toMatchInlineSnapshot(`
      [
        [
          "2024-01-28",
          "2024-01-29",
          "2024-01-30",
          "2024-01-31",
          "2024-02-01",
          "2024-02-02",
          "2024-02-03",
        ],
        [
          "2024-02-04",
          "2024-02-05",
          "2024-02-06",
          "2024-02-07",
          "2024-02-08",
          "2024-02-09",
          "2024-02-10",
        ],
        [
          "2024-02-11",
          "2024-02-12",
          "2024-02-13",
          "2024-02-14",
          "2024-02-15",
          "2024-02-16",
          "2024-02-17",
        ],
        [
          "2024-02-18",
          "2024-02-19",
          "2024-02-20",
          "2024-02-21",
          "2024-02-22",
          "2024-02-23",
          "2024-02-24",
        ],
        [
          "2024-02-25",
          "2024-02-26",
          "2024-02-27",
          "2024-02-28",
          "2024-02-29",
          "2024-03-01",
          "2024-03-02",
        ],
      ]
    `)
  })

  it('handles February in non-leap year', () => {
    const days = getMonthDays(new CalendarDate(2023, 2, 1), 'en')
    const dateStrings = days.map(weeks => weeks.map(date => date?.toString()))
    expect(dateStrings).toMatchInlineSnapshot(`
      [
        [
          "2023-01-29",
          "2023-01-30",
          "2023-01-31",
          "2023-02-01",
          "2023-02-02",
          "2023-02-03",
          "2023-02-04",
        ],
        [
          "2023-02-05",
          "2023-02-06",
          "2023-02-07",
          "2023-02-08",
          "2023-02-09",
          "2023-02-10",
          "2023-02-11",
        ],
        [
          "2023-02-12",
          "2023-02-13",
          "2023-02-14",
          "2023-02-15",
          "2023-02-16",
          "2023-02-17",
          "2023-02-18",
        ],
        [
          "2023-02-19",
          "2023-02-20",
          "2023-02-21",
          "2023-02-22",
          "2023-02-23",
          "2023-02-24",
          "2023-02-25",
        ],
        [
          "2023-02-26",
          "2023-02-27",
          "2023-02-28",
          "2023-03-01",
          "2023-03-02",
          "2023-03-03",
          "2023-03-04",
        ],
      ]
    `)
  })

  it('handles December (year end transition)', () => {
    const days = getMonthDays(new CalendarDate(2023, 12, 1), 'en')
    const dateStrings = days.map(weeks => weeks.map(date => date?.toString()))
    expect(dateStrings).toMatchInlineSnapshot(`
      [
        [
          "2023-11-26",
          "2023-11-27",
          "2023-11-28",
          "2023-11-29",
          "2023-11-30",
          "2023-12-01",
          "2023-12-02",
        ],
        [
          "2023-12-03",
          "2023-12-04",
          "2023-12-05",
          "2023-12-06",
          "2023-12-07",
          "2023-12-08",
          "2023-12-09",
        ],
        [
          "2023-12-10",
          "2023-12-11",
          "2023-12-12",
          "2023-12-13",
          "2023-12-14",
          "2023-12-15",
          "2023-12-16",
        ],
        [
          "2023-12-17",
          "2023-12-18",
          "2023-12-19",
          "2023-12-20",
          "2023-12-21",
          "2023-12-22",
          "2023-12-23",
        ],
        [
          "2023-12-24",
          "2023-12-25",
          "2023-12-26",
          "2023-12-27",
          "2023-12-28",
          "2023-12-29",
          "2023-12-30",
        ],
        [
          "2023-12-31",
          "2024-01-01",
          "2024-01-02",
          "2024-01-03",
          "2024-01-04",
          "2024-01-05",
          "2024-01-06",
        ],
      ]
    `)
  })

  it('works with different firstDayOfWeek values', () => {
    const testCases = [0, 1, 2, 3, 4, 5, 6]
    testCases.forEach((firstDay) => {
      const days = getMonthDays(new CalendarDate(2023, 6, 15), 'en', undefined, firstDay)
      // Each week should have exactly 7 days
      days.forEach((week) => {
        expect(week).toHaveLength(7)
      })
      // All weeks should contain consecutive dates
      days.forEach((week) => {
        for (let i = 1; i < week.length; i++) {
          const prevDate = week[i - 1]
          const currentDate = week[i]
          expect(currentDate.subtract({ days: 1 }).compare(prevDate)).toBe(0)
        }
      })
    })
  })

  it('respects custom numOfWeeks parameter', () => {
    const days = getMonthDays(new CalendarDate(2023, 6, 1), 'en', 4)
    expect(days).toHaveLength(4)
    days.forEach((week) => {
      expect(week).toHaveLength(7)
    })
  })

  it('works with different locales', () => {
    const locales = ['en', 'de', 'fr', 'ja', 'ar']
    locales.forEach((locale) => {
      const days = getMonthDays(new CalendarDate(2023, 6, 15), locale)
      // Should return valid structure regardless of locale
      expect(Array.isArray(days)).toBe(true)
      expect(days.length).toBeGreaterThan(0)
      days.forEach((week) => {
        expect(week).toHaveLength(7)
      })
    })
  })

  it('handles 30-day months correctly', () => {
    // Test April (30 days)
    const days = getMonthDays(new CalendarDate(2023, 4, 1), 'en')
    const flatDates = days.flat()
    const aprilDates = flatDates.filter(date => date.month === 4)
    expect(aprilDates).toHaveLength(30)
  })

  it('handles 31-day months correctly', () => {
    // Test March (31 days)
    const days = getMonthDays(new CalendarDate(2023, 3, 1), 'en')
    const flatDates = days.flat()
    const marchDates = flatDates.filter(date => date.month === 3)
    expect(marchDates).toHaveLength(31)
  })

  it('ensures all weeks have exactly 7 days', () => {
    const testMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    testMonths.forEach((month) => {
      const days = getMonthDays(new CalendarDate(2023, month, 1), 'en')
      days.forEach((week) => {
        expect(week).toHaveLength(7)
      })
    })
  })

  it('ensures consecutive dates across weeks', () => {
    const days = getMonthDays(new CalendarDate(2023, 6, 1), 'en')
    for (let i = 1; i < days.length; i++) {
      const lastDayOfPrevWeek = days[i - 1][6]
      const firstDayOfCurrentWeek = days[i][0]
      expect(firstDayOfCurrentWeek.subtract({ days: 1 }).compare(lastDayOfPrevWeek)).toBe(0)
    }
  })

  it('includes target month date in the result', () => {
    const targetDate = new CalendarDate(2023, 6, 15)
    const days = getMonthDays(targetDate, 'en')
    const flatDates = days.flat()
    const hasTargetDate = flatDates.some(date =>
      date.year === targetDate.year
      && date.month === targetDate.month
      && date.day === targetDate.day,
    )
    expect(hasTargetDate).toBe(true)
  })
})
