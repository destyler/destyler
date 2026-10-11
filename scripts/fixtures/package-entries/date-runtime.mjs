import assert from 'node:assert/strict'
import process from 'node:process'
import * as peerModule from '@internationalized/date'

// Test the actual installed peer's identities without assuming named CJS exports.
const peer = Reflect.get(peerModule, 'default') ?? peerModule

export function assertDateRuntime(date) {
  const NativeDate = Date
  const originalZone = process.env.TZ
  let parserAssertions = 0
  function freeze(instant) {
    globalThis.Date = class extends NativeDate {
      constructor(...args) {
        super(...(args.length ? args : [instant]))
      }

      static now() {
        return new NativeDate(instant).valueOf()
      }
    }
  }

  try {
    // Preserve all 216 ISO cases: host zone × clock × locale × requested zone × input.
    for (const hostZone of ['UTC', 'America/Los_Angeles', 'Asia/Tokyo']) {
      process.env.TZ = hostZone
      for (const frozen of ['2026-10-11T00:30:00Z', '2020-07-04T12:00:00Z']) {
        freeze(frozen)
        for (const locale of ['ja-JP', 'zh-CN', 'en-US']) {
          for (const zone of ['UTC', 'America/Los_Angeles', 'Asia/Tokyo']) {
            for (const input of ['2024-03-10', '2024-02-29', '0099-12-31', '9999-12-31']) {
              assert.equal(date.parseDateString(input, locale, zone).toString(), input)
              parserAssertions++
            }
          }
        }
      }
    }
    assert.equal(parserAssertions, 216)

    process.env.TZ = 'UTC'
    freeze('2024-03-10T12:00:00Z')
    const start = new peer.CalendarDate(2023, 1, 10)
    const end = new peer.CalendarDate(2023, 1, 12)
    const formatter = date.getDayFormatter('en-US', 'UTC')
    assert.ok(date.parseDateString('2024-02-29', 'ja-JP', 'UTC') instanceof peer.CalendarDate)
    assert.ok(formatter instanceof peer.DateFormatter)
    assert.equal(date.formatSelectedDate(start, null, 'en-US', 'UTC'), 'Tuesday, January 10, 2023')
    assert.equal(date.formatRange(start, end, formatter, (from, to) => `${from} / ${to}`, 'UTC'), 'Tuesday, January 10 / Thursday, January 12, 2023')
    assert.equal(date.formatVisibleRange(new peer.CalendarDate(2024, 2, 1), new peer.CalendarDate(2024, 2, 29), 'en-US', 'UTC'), 'February 2024')
    assert.equal(date.isDateEqual(start, new peer.CalendarDate(2023, 1, 10)), true)

    const today = date.getTodayDate('UTC')
    assert.ok(today instanceof peer.CalendarDate)
    assert.equal(today.toString(), '2024-03-10')
    assert.equal(date.getTodayDate().toString(), '2024-03-10')
    const converted = date.setCalendar(today, new peer.GregorianCalendar())
    assert.ok(converted instanceof peer.CalendarDateTime)
    assert.equal(converted.toString(), '2024-03-10T00:00:00')
    const minimum = new peer.CalendarDateTime(2024, 3, 12, 9)
    const maximum = new peer.CalendarDateTime(2024, 3, 14, 18)
    const constrained = date.constrainValue(today, minimum, maximum)
    assert.ok(constrained instanceof peer.CalendarDate)
    assert.equal(constrained.toString(), '2024-03-12')
    assert.equal(date.constrainValue(today.add({ days: 10 }), minimum, maximum).toString(), '2024-03-14')
    assert.equal(date.alignStart(today, { months: 1 }, 'en-US').toString(), '2024-03-01')
    assert.equal(date.alignStart(today, { years: 1 }, 'en-US').toString(), '2024-01-01')

    // Locale defaults exercise the bindings. Explicit weekday overrides have a
    // separate known minimum-peer behavior gap and are not covered by this gate.
    assert.equal(date.getStartOfWeek(today, 'en-US').toString(), '2024-03-10')
    assert.equal(date.getEndOfWeek(today, 'en-US').toString(), '2024-03-16')
    const month = date.getMonthDays(new peer.CalendarDate(2023, 10, 1), 'en-US')
    assert.equal(month.length, 5)
    assert.deepEqual(month.map(week => week.length), [7, 7, 7, 7, 7])
    assert.equal(month[0][0].toString(), '2023-10-01')
    assert.equal(month[4][6].toString(), '2023-11-04')
    const weekdays = date.getWeekDays(today, undefined, 'UTC', 'en-US')
    assert.deepEqual(weekdays.map(day => day.long), ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
    assert.equal(date.getSectionStart(today.add({ days: 2 }), today, { weeks: 1 }, 'en-US').focusedDate.toString(), '2024-03-10')
    assert.equal(date.getSectionEnd(today.add({ days: 2 }), today, { weeks: 1 }, 'en-US').focusedDate.toString(), '2024-03-16')
    for (const [preset, expected] of [
      ['thisWeek', ['2024-03-10', '2024-03-16']],
      ['lastMonth', ['2024-02-01', '2024-02-29']],
      ['lastYear', ['2023-01-01', '2023-12-31']],
    ]) {
      assert.deepEqual(date.getDateRangePreset(preset, 'en-US', 'UTC').map(value => value.toString().slice(0, 10)), expected)
    }
    for (const name of ['CalendarDate', 'DateFormatter', 'endOfMonth', 'endOfWeek', 'endOfYear', 'getLocalTimeZone', 'getWeeksInMonth', 'isSameDay', 'maxDate', 'minDate', 'now', 'startOfMonth', 'startOfWeek', 'startOfYear', 'toCalendar', 'toCalendarDate', 'toCalendarDateTime', 'today'])
      assert.equal(Object.hasOwn(date, name), false, `${name}: private bridge binding must not become public`)
  }
  finally {
    globalThis.Date = NativeDate
    if (originalZone === undefined)
      delete process.env.TZ
    else
      process.env.TZ = originalZone
  }
  console.log(`Date runtime: ${parserAssertions} ISO parser assertions and public format/range/mutation/month binding assertions passed`)
}
