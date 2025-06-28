import { CalendarDate } from '@internationalized/date'
import { describe, expect, it } from 'vitest'
import { getEndOfWeek, getStartOfWeek, getWeekDays } from '../index'

function exec(locale: string, weekStartDay?: number) {
  const today = new CalendarDate(2024, 8, 21)
  const days = getWeekDays(today, weekStartDay, 'UTC', locale)
  // console.log(days.map((d) => `${d.short} ${d.value.day}`).join(","))
  return days[0].value.day
}

describe('getStartOfWeek', () => {
  it('en locale', () => {
    expect(exec('en')).toBe(18)
    expect(exec('en', 0)).toBe(18)
    expect(exec('en', 1)).toBe(19)
  })

  it('fr locale', () => {
    expect(exec('fr')).toBe(19)
    expect(exec('fr', 0)).toBe(18)
    expect(exec('fr', 1)).toBe(19)
    expect(exec('fr', 2)).toBe(20)
  })

  it('handles all possible firstDayOfWeek values (0-6)', () => {
    const testDate = new CalendarDate(2024, 8, 21) // Wednesday
    const expectedStartDays = [18, 19, 20, 21, 15, 16, 17] // Expected start days for each firstDayOfWeek

    for (let firstDay = 0; firstDay <= 6; firstDay++) {
      const days = getWeekDays(testDate, firstDay, 'UTC', 'en')
      expect(days[0].value.day).toBe(expectedStartDays[firstDay])
    }
  })

  it('handles month boundary correctly', () => {
    // Test date near month end
    const endOfMonth = new CalendarDate(2024, 8, 31) // Saturday
    const days = getWeekDays(endOfMonth, 0, 'UTC', 'en') // Sunday start
    expect(days[0].value.month).toBe(8) // Should start in August
    expect(days[0].value.day).toBe(25) // Sunday before Saturday 31st
  })

  it('handles year boundary correctly', () => {
    // Test date at year end
    const yearEnd = new CalendarDate(2024, 12, 31) // Tuesday
    const days = getWeekDays(yearEnd, 0, 'UTC', 'en') // Sunday start
    expect(days[0].value.year).toBe(2024)
    expect(days[0].value.month).toBe(12)
    expect(days[0].value.day).toBe(29) // Sunday before Tuesday 31st
  })

  it('handles leap year February correctly', () => {
    const leapYearFeb = new CalendarDate(2024, 2, 29) // Thursday
    const days = getWeekDays(leapYearFeb, 1, 'UTC', 'en') // Monday start
    expect(days[0].value.month).toBe(2)
    expect(days[0].value.day).toBe(26) // Monday before Thursday 29th
  })

  it('returns exactly 7 days for any date and firstDayOfWeek', () => {
    const testDates = [
      new CalendarDate(2024, 1, 1), // New Year
      new CalendarDate(2024, 2, 29), // Leap day
      new CalendarDate(2024, 12, 31), // Year end
      new CalendarDate(2024, 6, 15), // Mid year
    ]

    testDates.forEach((date) => {
      for (let firstDay = 0; firstDay <= 6; firstDay++) {
        const days = getWeekDays(date, firstDay, 'UTC', 'en')
        expect(days).toHaveLength(7)
      }
    })
  })

  it('returns consecutive dates', () => {
    const testDate = new CalendarDate(2024, 6, 15)
    const days = getWeekDays(testDate, 0, 'UTC', 'en')

    for (let i = 1; i < days.length; i++) {
      const prevDay = days[i - 1].value
      const currentDay = days[i].value
      expect(currentDay.subtract({ days: 1 }).compare(prevDay)).toBe(0)
    }
  })

  it('includes the target date in the week', () => {
    const testDate = new CalendarDate(2024, 6, 15)
    const days = getWeekDays(testDate, 0, 'UTC', 'en')

    const hasTargetDate = days.some(day =>
      day.value.year === testDate.year
      && day.value.month === testDate.month
      && day.value.day === testDate.day,
    )
    expect(hasTargetDate).toBe(true)
  })

  it('works with different locales', () => {
    const testDate = new CalendarDate(2024, 6, 15)
    const locales = ['en', 'fr', 'de', 'ja', 'ar', 'zh-CN', 'es', 'ru']

    locales.forEach((locale) => {
      const days = getWeekDays(testDate, undefined, 'UTC', locale)
      expect(days).toHaveLength(7)
      days.forEach((day) => {
        expect(day.short).toBeTruthy()
        expect(day.long).toBeTruthy()
        expect(day.narrow).toBeTruthy()
      })
    })
  })

  it('formats weekday names correctly', () => {
    const testDate = new CalendarDate(2024, 6, 15) // Saturday
    const days = getWeekDays(testDate, 0, 'UTC', 'en') // Sunday start

    // Check that we have different format lengths
    days.forEach((day) => {
      expect(day.narrow.length).toBeLessThanOrEqual(day.short.length)
      expect(day.short.length).toBeLessThanOrEqual(day.long.length)
    })

    // Check Sunday formats (first day with Sunday start)
    expect(days[0].narrow).toBe('S')
    expect(days[0].short).toBe('Sun')
    expect(days[0].long).toBe('Sunday')
  })

  it('getStartOfWeek returns correct start date', () => {
    const testDate = new CalendarDate(2024, 8, 21) // Wednesday

    // Sunday start (0)
    const sundayStart = getStartOfWeek(testDate, 'en', 0)
    expect(sundayStart.day).toBe(18)

    // Monday start (1)
    const mondayStart = getStartOfWeek(testDate, 'en', 1)
    expect(mondayStart.day).toBe(19)

    // Saturday start (6)
    const saturdayStart = getStartOfWeek(testDate, 'en', 6)
    expect(saturdayStart.day).toBe(17)
  })

  it('getEndOfWeek returns correct end date', () => {
    const testDate = new CalendarDate(2024, 8, 21) // Wednesday

    // Sunday start (0) means Saturday end
    const sundayWeekEnd = getEndOfWeek(testDate, 'en', 0)
    expect(sundayWeekEnd.day).toBe(24)

    // Monday start (1) means Sunday end
    const mondayWeekEnd = getEndOfWeek(testDate, 'en', 1)
    expect(mondayWeekEnd.day).toBe(25)
  })

  it('handles edge case where date is already start of week', () => {
    const sunday = new CalendarDate(2024, 8, 18) // Sunday
    const days = getWeekDays(sunday, 0, 'UTC', 'en') // Sunday start
    expect(days[0].value.day).toBe(18) // Should be same day
  })

  it('handles different time zones consistently', () => {
    const testDate = new CalendarDate(2024, 6, 15)
    const timeZones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']

    timeZones.forEach((tz) => {
      const days = getWeekDays(testDate, 0, tz, 'en')
      expect(days).toHaveLength(7)
      // The CalendarDate should remain the same regardless of timezone
      // since we're dealing with calendar dates, not time instances
      expect(days.some(day =>
        day.value.year === testDate.year
        && day.value.month === testDate.month
        && day.value.day === testDate.day,
      )).toBe(true)
    })
  })

  it('maintains week structure across month boundaries', () => {
    // Test various dates that cross month boundaries
    const boundaryDates = [
      new CalendarDate(2024, 1, 31), // January 31st
      new CalendarDate(2024, 2, 1), // February 1st
      new CalendarDate(2024, 3, 1), // March 1st (after Feb in leap year)
    ]

    boundaryDates.forEach((date) => {
      const days = getWeekDays(date, 1, 'UTC', 'en') // Monday start
      expect(days).toHaveLength(7)

      // Verify consecutive dates
      for (let i = 1; i < days.length; i++) {
        const prevDay = days[i - 1].value
        const currentDay = days[i].value
        expect(currentDay.subtract({ days: 1 }).compare(prevDay)).toBe(0)
      }
    })
  })
})
