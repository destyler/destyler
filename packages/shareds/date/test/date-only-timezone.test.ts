import { describe, expect, it } from 'vitest'
import { parseDateString } from '../index'

describe('date-only fallback time zones', () => {
  it.each([
    ['2023-12-25', '2023-12-25'],
    ['2025', '2025-01-01'],
    ['2023-12', '2023-12-01'],
    ['2024-02-29', '2024-02-29'],
    ['2024-03-10', '2024-03-10'],
    ['2024-11-03', '2024-11-03'],
    ['2024-01-01', '2024-01-01'],
    ['2023/12/25', '2023-12-25'],
    ['2023.12.25', '2023-12-25'],
    [' 2023-12-25 ', '2023-12-25'],
    ['2023-12-25\n', '2023-12-25'],
    ['2023-12-25\t', '2023-12-25'],
    ['2023-2-5', '2023-02-05'],
    ['2023-02-29', '2023-03-01', '2023-02-28'],
    ['2023-02-30', '2023-03-02', '2023-03-01'],
    ['2023-04-31', '2023-05-01', '2023-04-30'],
  ])('preserves fallback %j across host and requested time zones', (input, expected, expectedInLosAngeles = expected) => {
    const originalTimeZone = process.env.TZ
    const timeZones = [
      { timeZone: 'UTC', offset: 0, day: 25, hour: 0 },
      { timeZone: 'America/Los_Angeles', offset: 480, day: 24, hour: 16 },
      { timeZone: 'Asia/Tokyo', offset: -540, day: 25, hour: 9 },
    ]
    try {
      for (const { timeZone: hostTimeZone, offset, day, hour } of timeZones) {
        process.env.TZ = hostTimeZone
        expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe(hostTimeZone)
        const instant = new Date('2023-12-25T00:00:00Z')
        expect(instant.getTimezoneOffset()).toBe(offset)
        expect([instant.getFullYear(), instant.getMonth() + 1, instant.getDate(), instant.getHours()])
          .toEqual([2023, 12, day, hour])
        const expectedDate = hostTimeZone === 'America/Los_Angeles' ? expectedInLosAngeles : expected
        for (const { timeZone } of timeZones) {
          expect(parseDateString(input, 'en-US', timeZone)?.toString()).toBe(expectedDate)
        }
      }
    }
    finally {
      if (originalTimeZone === undefined)
        delete process.env.TZ
      else
        process.env.TZ = originalTimeZone
    }
  })
})
