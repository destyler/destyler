import { describe, expect, it } from 'vitest'
import { formatDate } from '../index'

const date = new Date('2024-01-02T03:04:05Z')
const locales = ['en-US', 'en-GB', 'de-DE', 'fr-FR', 'ja-JP', 'ar-EG']
function zone(date: Date, locale: string, timeZone: string, timeZoneName: 'shortOffset' | 'longOffset') {
  return new Intl.DateTimeFormat(locale, { timeZone, timeZoneName }).formatToParts(date).find(part => part.type === 'timeZoneName')?.value
}

describe('date formatter locale-safe timezone extraction', () => {
  it.each(locales)('does not crash while formatting a year in %s', (locale) => {
    expect(formatDate(date, 'yyyy', locale, 'UTC'))
      .toBe(date.toLocaleString(locale, { year: 'numeric' }).padStart(4, '0'))
  })

  it.each(locales)('extracts timezone offsets in %s independently of day-period grammar', (locale) => {
    for (const timeZone of ['UTC', 'Asia/Kolkata', 'America/New_York']) {
      const short = zone(date, locale, timeZone, 'shortOffset')
      const long = zone(date, locale, timeZone, 'longOffset')
      expect(short).toBeDefined()
      expect(long).toBeDefined()
      expect(formatDate(date, 'z', locale, timeZone)).toBe(short)
      expect(formatDate(date, 'zz', locale, timeZone)).toBe(short)
      expect(formatDate(date, 'zzz', locale, timeZone)).toBe(short)
      expect(formatDate(date, 'zzzz', locale, timeZone)).toBe(long)
    }
  })

  it('preserves existing en-US date and offset output', () => {
    expect(formatDate(date, 'yyyy-MM-dd HH:mm:ss z', 'en-US', 'UTC')).toBe(`2024-01-02 03:4:5 ${zone(date, 'en-US', 'UTC', 'shortOffset')}`)
  })

  it('uses the supplied date when an offset changes across DST', () => {
    for (const date of [new Date('2024-01-15T12:00:00Z'), new Date('2024-07-15T12:00:00Z')]) {
      expect(formatDate(date, 'z', 'en-US', 'America/New_York'))
        .toBe(zone(date, 'en-US', 'America/New_York', 'shortOffset'))
    }
  })

  it('keeps invalid locale and timezone rejection', () => {
    expect(() => formatDate(date, 'yyyy', 'not_a_locale', 'UTC')).toThrow(RangeError)
    expect(() => formatDate(date, 'z', 'en-US', 'invalid-zone')).toThrow(RangeError)
  })
})
