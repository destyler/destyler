import { describe, expect, it, vi } from 'vitest'
import { parseDateString } from '../index'

const timeZones = ['UTC', 'America/Los_Angeles', 'Asia/Tokyo']

function withDateContexts(assertion: (today: Date, timeZone: string) => void) {
  const originalTimeZone = process.env.TZ
  vi.useFakeTimers({ toFake: ['Date'] })
  try {
    for (const hostTimeZone of timeZones) {
      process.env.TZ = hostTimeZone
      expect(new Intl.DateTimeFormat().resolvedOptions().timeZone).toBe(hostTimeZone)
      for (const now of ['2026-10-11T00:30:00Z', '2020-07-04T12:00:00Z']) {
        vi.setSystemTime(new Date(now))
        for (const timeZone of timeZones) {
          assertion(new Date(), timeZone)
        }
      }
    }
  }
  finally {
    vi.useRealTimers()
    if (originalTimeZone === undefined)
      delete process.env.TZ
    else
      process.env.TZ = originalTimeZone
  }
}

describe.each(['ja-JP', 'zh-CN'])('complete ISO dates in %s', (locale) => {
  it.each([
    '0001-01-01',
    '0099-12-31',
    '1900-02-28',
    '2000-02-29',
    '2023-12-25',
    '2024-01-01',
    '2024-02-29',
    '2024-03-10',
    '2024-11-03',
    '9999-12-31',
  ])('uses every component of %s independently of today and time zone', (input) => {
    withDateContexts((_, timeZone) => {
      expect(parseDateString(input, locale, timeZone)?.toString()).toBe(input)
    })
  })

  it.each([
    '2023-02-29',
    '2023-04-31',
    '2023-00-10',
    '2023-13-10',
    '2023-03-00',
    '2023-03-32',
  ])('keeps the existing locale path for invalid ISO date %s', (input) => {
    withDateContexts((today, timeZone) => {
      expect(parseDateString(input, locale, timeZone)).toMatchObject({
        year: 2023,
        month: today.getMonth() + 1,
        day: today.getDate(),
      })
    })
  })

  it.each([
    '2024',
    '2024-03',
    '2024-3-10',
    '2024-03-10\n',
    '2024-03-10\t',
    '2024-03-10T00:30:00+09:00',
  ])('keeps the existing locale path for incomplete or non-date-only input %j', (input) => {
    withDateContexts((today, timeZone) => {
      expect(parseDateString(input, locale, timeZone)).toMatchObject({
        year: 2024,
        month: today.getMonth() + 1,
        day: today.getDate(),
      })
    })
  })

  it('keeps a partial local year/month dependent on the current day', () => {
    withDateContexts((today, timeZone) => {
      expect(parseDateString('2024/03', locale, timeZone)).toMatchObject({
        year: 2024,
        month: 3,
        day: today.getDate(),
      })
    })
  })

  it('keeps the existing year-zero normalization', () => {
    withDateContexts((today, timeZone) => {
      expect(parseDateString('0000-01-01', locale, timeZone)).toMatchObject({
        year: 1,
        month: today.getMonth() + 1,
        day: today.getDate(),
      })
    })
  })
})

describe('locale parsing compatibility', () => {
  it.each([
    ['ja-JP', '2024/03/10'],
    ['zh-CN', '2024/03/10'],
    ['en-US', '03/10/2024'],
    ['en-GB', '10/03/2024'],
    ['de-DE', '10.03.2024'],
  ])('keeps the complete local format for %s', (locale, input) => {
    withDateContexts((_, timeZone) => {
      expect(parseDateString(input, locale, timeZone)?.toString()).toBe('2024-03-10')
    })
  })

  it('still validates the locale and time zone for ISO dates', () => {
    expect(() => parseDateString('2024-03-10', 'invalid_locale', 'UTC')).toThrow(RangeError)
    expect(() => parseDateString('2024-03-10', 'ja-JP', 'Invalid/TimeZone')).toThrow(RangeError)
  })
})
