import { parseDate } from '@internationalized/date'
import { describe, expect, it } from 'vitest'
import {
  constrainValue,
  getAdjustedDateFn,
  getNextPage,
  getNextRow,
  getNextSection,
  getPreviousPage,
  getPreviousRow,
  getPreviousSection,
  getSectionEnd,
  getSectionStart,
} from '../index'

const locale = 'en-US'
const duration = { months: 1 }
const weekDuration = { weeks: 1 }
const dayDuration = { days: 7 }
const yearDuration = { years: 1 }

const min = parseDate('2023-01-01')
const max = parseDate('2023-12-31')

function stringify(opts: any) {
  return {
    startDate: opts.startDate.toString(),
    endDate: opts.endDate.toString(),
    focusedDate: opts.focusedDate.toString(),
  }
}

describe('date utilities', () => {
  it('constrain', () => {
    const focusedDate = parseDate('2024-03-15')
    expect(constrainValue(focusedDate, min, max).toString()).toMatchInlineSnapshot(`"2023-12-31"`)
  })

  it('pagination / next page', () => {
    const focusedDate = parseDate('2023-01-12')
    const startDate = parseDate('2023-01-01')
    const nextPage = getNextPage(focusedDate, startDate, duration, locale, min, max)
    expect(stringify(nextPage)).toMatchInlineSnapshot(`
      {
        "endDate": "2023-02-28",
        "focusedDate": "2023-02-12",
        "startDate": "2023-02-01",
      }
    `)
  })

  it('pagination / prev page', () => {
    const focusedDate = parseDate('2023-01-12')
    const startDate = parseDate('2023-01-01')
    const prevPage = getPreviousPage(focusedDate, startDate, duration, locale, min, max)
    expect(stringify(prevPage)).toMatchInlineSnapshot(`
      {
        "endDate": "2023-01-31",
        "focusedDate": "2023-01-01",
        "startDate": "2023-01-01",
      }
    `)
  })

  describe('getAdjustedDateFn', () => {
    const adjustFn = getAdjustedDateFn(duration, locale, min, max)

    it('should return same dates when focused date is within range', () => {
      const startDate = parseDate('2023-03-01')
      const focusedDate = parseDate('2023-03-15')
      const result = adjustFn({ startDate, focusedDate })

      expect(stringify(result)).toMatchInlineSnapshot(`
        {
          "endDate": "2023-03-31",
          "focusedDate": "2023-03-15",
          "startDate": "2023-03-01",
        }
      `)
    })

    it('should constrain focused date when invalid', () => {
      const startDate = parseDate('2023-03-01')
      const focusedDate = parseDate('2024-01-15') // beyond max
      const result = adjustFn({ startDate, focusedDate })

      expect(result.focusedDate.toString()).toBe('2023-12-31')
    })

    it('should adjust start date when focused date is before visible range', () => {
      const startDate = parseDate('2023-03-01')
      const focusedDate = parseDate('2023-02-15')
      const result = adjustFn({ startDate, focusedDate })

      expect(result.focusedDate.toString()).toBe('2023-02-15')
      expect(result.startDate.compare(startDate)).toBeLessThan(0)
    })

    it('should adjust start date when focused date is after visible range', () => {
      const startDate = parseDate('2023-03-01')
      const focusedDate = parseDate('2023-04-15')
      const result = adjustFn({ startDate, focusedDate })

      expect(result.focusedDate.toString()).toBe('2023-04-15')
      expect(result.startDate.compare(startDate)).toBeGreaterThan(0)
    })
  })

  describe('pagination with different durations', () => {
    it('next page with week duration', () => {
      const focusedDate = parseDate('2023-03-15')
      const startDate = parseDate('2023-03-13')
      const nextPage = getNextPage(focusedDate, startDate, weekDuration, locale, min, max)

      expect(stringify(nextPage)).toMatchInlineSnapshot(`
        {
          "endDate": "2023-03-25",
          "focusedDate": "2023-03-22",
          "startDate": "2023-03-19",
        }
      `)
    })

    it('previous page with week duration', () => {
      const focusedDate = parseDate('2023-03-15')
      const startDate = parseDate('2023-03-13')
      const prevPage = getPreviousPage(focusedDate, startDate, weekDuration, locale, min, max)

      expect(stringify(prevPage)).toMatchInlineSnapshot(`
        {
          "endDate": "2023-03-11",
          "focusedDate": "2023-03-08",
          "startDate": "2023-03-05",
        }
      `)
    })

    it('next page with day duration', () => {
      const focusedDate = parseDate('2023-03-15')
      const startDate = parseDate('2023-03-10')
      const nextPage = getNextPage(focusedDate, startDate, dayDuration, locale, min, max)

      expect(stringify(nextPage)).toMatchInlineSnapshot(`
        {
          "endDate": "2023-03-23",
          "focusedDate": "2023-03-22",
          "startDate": "2023-03-17",
        }
      `)
    })

    it('should respect min/max boundaries in pagination', () => {
      const focusedDate = parseDate('2023-12-15')
      const startDate = parseDate('2023-12-01')
      const nextPage = getNextPage(focusedDate, startDate, duration, locale, min, max)

      // Should not go beyond max date
      expect(nextPage.focusedDate.compare(max)).toBeLessThanOrEqual(0)
      expect(nextPage.startDate.compare(max)).toBeLessThanOrEqual(0)
    })
  })

  describe('row navigation', () => {
    it('next row with month duration', () => {
      const focusedDate = parseDate('2023-03-15')
      const startDate = parseDate('2023-03-01')
      const nextRow = getNextRow(focusedDate, startDate, duration, locale, min, max)

      expect(stringify(nextRow)).toMatchInlineSnapshot(`
        {
          "endDate": "2023-03-31",
          "focusedDate": "2023-03-22",
          "startDate": "2023-03-01",
        }
      `)
    })

    it('previous row with month duration', () => {
      const focusedDate = parseDate('2023-03-15')
      const startDate = parseDate('2023-03-01')
      const prevRow = getPreviousRow(focusedDate, startDate, duration, locale, min, max)

      expect(stringify(prevRow)).toMatchInlineSnapshot(`
        {
          "endDate": "2023-03-31",
          "focusedDate": "2023-03-08",
          "startDate": "2023-03-01",
        }
      `)
    })

    it('next row with day duration should behave like next page', () => {
      const focusedDate = parseDate('2023-03-15')
      const startDate = parseDate('2023-03-10')
      const nextRow = getNextRow(focusedDate, startDate, dayDuration, locale, min, max)
      const nextPage = getNextPage(focusedDate, startDate, dayDuration, locale, min, max)

      expect(stringify(nextRow)).toEqual(stringify(nextPage))
    })
  })

  describe('section navigation', () => {
    it('section start with month duration', () => {
      const focusedDate = parseDate('2023-03-15')
      const startDate = parseDate('2023-03-01')
      const sectionStart = getSectionStart(focusedDate, startDate, duration, locale, min, max)

      expect(stringify(sectionStart)).toMatchInlineSnapshot(`
        {
          "endDate": "2023-03-31",
          "focusedDate": "2023-03-01",
          "startDate": "2023-03-01",
        }
      `)
    })

    it('section end with month duration', () => {
      const focusedDate = parseDate('2023-03-15')
      const startDate = parseDate('2023-03-01')
      const sectionEnd = getSectionEnd(focusedDate, startDate, duration, locale, min, max)

      expect(stringify(sectionEnd)).toMatchInlineSnapshot(`
        {
          "endDate": "2023-03-31",
          "focusedDate": "2023-03-31",
          "startDate": "2023-03-01",
        }
      `)
    })

    it('section start with week duration', () => {
      const focusedDate = parseDate('2023-03-15') // Wednesday
      const startDate = parseDate('2023-03-13') // Monday
      const sectionStart = getSectionStart(focusedDate, startDate, weekDuration, locale, min, max)

      expect(sectionStart?.focusedDate.toString()).toBe('2023-03-12') // Sunday (start of week in en-US)
    })

    it('section end with week duration', () => {
      const focusedDate = parseDate('2023-03-15')
      const startDate = parseDate('2023-03-13')
      const sectionEnd = getSectionEnd(focusedDate, startDate, weekDuration, locale, min, max)

      expect(sectionEnd?.focusedDate.toString()).toBe('2023-03-18') // Saturday (end of week in en-US)
    })

    it('next section with month duration and larger=false', () => {
      const focusedDate = parseDate('2023-03-15')
      const startDate = parseDate('2023-03-01')
      const nextSection = getNextSection(focusedDate, startDate, false, duration, locale, min, max)

      expect(stringify(nextSection)).toMatchInlineSnapshot(`
        {
          "endDate": "2023-03-31",
          "focusedDate": "2023-04-15",
          "startDate": "2023-04-01",
        }
      `)
    })

    it('next section with week duration and larger=true', () => {
      const focusedDate = parseDate('2023-03-15')
      const startDate = parseDate('2023-03-13')
      const nextSection = getNextSection(focusedDate, startDate, true, weekDuration, locale, min, max)

      expect(stringify(nextSection)).toMatchInlineSnapshot(`
        {
          "endDate": "2023-03-19",
          "focusedDate": "2023-04-15",
          "startDate": "2023-04-09",
        }
      `)
    })

    it('previous section with year duration', () => {
      const focusedDate = parseDate('2023-06-15')
      const startDate = parseDate('2023-01-01')
      const prevSection = getPreviousSection(focusedDate, startDate, false, yearDuration, locale, min, max)

      expect(stringify(prevSection)).toMatchInlineSnapshot(`
        {
          "endDate": "2023-12-31",
          "focusedDate": "2023-01-01",
          "startDate": "2023-01-01",
        }
      `)
    })
  })

  describe('edge cases and boundary conditions', () => {
    it('should handle navigation at min boundary', () => {
      const focusedDate = parseDate('2023-01-15')
      const startDate = parseDate('2023-01-01')
      const prevPage = getPreviousPage(focusedDate, startDate, duration, locale, min, max)

      // Should not go before min date
      expect(prevPage.focusedDate.compare(min)).toBeGreaterThanOrEqual(0)
      expect(prevPage.startDate.compare(min)).toBeGreaterThanOrEqual(0)
    })

    it('should handle navigation at max boundary', () => {
      const focusedDate = parseDate('2023-12-15')
      const startDate = parseDate('2023-12-01')
      const nextPage = getNextPage(focusedDate, startDate, duration, locale, min, max)

      // Should not go beyond max date
      expect(nextPage.focusedDate.compare(max)).toBeLessThanOrEqual(0)
    })

    it('should handle navigation without min/max constraints', () => {
      const focusedDate = parseDate('2023-03-15')
      const startDate = parseDate('2023-03-01')
      const nextPage = getNextPage(focusedDate, startDate, duration, locale)

      expect(stringify(nextPage)).toMatchInlineSnapshot(`
        {
          "endDate": "2023-04-30",
          "focusedDate": "2023-04-15",
          "startDate": "2023-04-01",
        }
      `)
    })

    it('should handle invalid focused date in adjustment', () => {
      const adjustFn = getAdjustedDateFn(duration, locale, min, max)
      const startDate = parseDate('2023-03-01')
      const invalidFocusedDate = parseDate('2020-01-01') // before min

      const result = adjustFn({ startDate, focusedDate: invalidFocusedDate })
      expect(result.focusedDate.toString()).toBe(min.toString())
    })

    it('should handle different locale for week calculations', () => {
      const mondayFirstLocale = 'de-DE' // Monday is first day of week
      const focusedDate = parseDate('2023-03-15') // Wednesday
      const startDate = parseDate('2023-03-13')

      const sectionStart = getSectionStart(focusedDate, startDate, weekDuration, mondayFirstLocale, min, max)
      expect(sectionStart?.focusedDate.toString()).toBe('2023-03-13') // Monday
    })
  })

  describe('section navigation with day duration', () => {
    it('section start with day duration', () => {
      const focusedDate = parseDate('2023-03-15')
      const startDate = parseDate('2023-03-10')
      const sectionStart = getSectionStart(focusedDate, startDate, dayDuration, locale, min, max)

      expect(stringify(sectionStart)).toMatchInlineSnapshot(`
        {
          "endDate": "2023-03-16",
          "focusedDate": "2023-03-10",
          "startDate": "2023-03-10",
        }
      `)
    })

    it('section end with day duration', () => {
      const focusedDate = parseDate('2023-03-15')
      const startDate = parseDate('2023-03-10')
      const sectionEnd = getSectionEnd(focusedDate, startDate, dayDuration, locale, min, max)

      expect(stringify(sectionEnd)).toMatchInlineSnapshot(`
        {
          "endDate": "2023-03-16",
          "focusedDate": "2023-03-16",
          "startDate": "2023-03-10",
        }
      `)
    })

    it('next section with day duration should behave like next page', () => {
      const focusedDate = parseDate('2023-03-15')
      const startDate = parseDate('2023-03-10')
      const nextSection = getNextSection(focusedDate, startDate, false, dayDuration, locale, min, max)
      const nextPage = getNextPage(focusedDate, startDate, dayDuration, locale, min, max)

      expect(stringify(nextSection)).toEqual(stringify(nextPage))
    })
  })
})
