import * as date from '@destyler/date'
import * as peer from '@internationalized/date'

function equal(actual, expected, message = 'Browser Date assertion failed') {
  if (JSON.stringify(actual) !== JSON.stringify(expected))
    throw new Error(`${message}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`)
}

export function assertDateBrowserRuntime() {
  const NativeDate = Date
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
    // The runner repeats these 72 cases in three real browser time zones.
    for (const frozen of ['2026-10-11T00:30:00Z', '2020-07-04T12:00:00Z']) {
      freeze(frozen)
      for (const locale of ['ja-JP', 'zh-CN', 'en-US']) {
        for (const zone of ['UTC', 'America/Los_Angeles', 'Asia/Tokyo']) {
          for (const input of ['2024-03-10', '2024-02-29', '0099-12-31', '9999-12-31']) {
            equal(date.parseDateString(input, locale, zone).toString(), input)
            parserAssertions++
          }
        }
      }
    }
    equal(parserAssertions, 72)

    freeze('2024-03-10T12:00:00Z')
    const start = new peer.CalendarDate(2023, 1, 10)
    const end = new peer.CalendarDate(2023, 1, 12)
    const formatter = date.getDayFormatter('en-US', 'UTC')
    equal(date.parseDateString('2024-02-29', 'ja-JP', 'UTC') instanceof peer.CalendarDate, true)
    equal(formatter instanceof peer.DateFormatter, true)
    equal(date.formatSelectedDate(start, null, 'en-US', 'UTC'), 'Tuesday, January 10, 2023')
    equal(date.formatRange(start, end, formatter, (from, to) => `${from} / ${to}`, 'UTC'), 'Tuesday, January 10 / Thursday, January 12, 2023')
    equal(date.formatVisibleRange(new peer.CalendarDate(2024, 2, 1), new peer.CalendarDate(2024, 2, 29), 'en-US', 'UTC'), 'February 2024')
    equal(date.isDateEqual(start, new peer.CalendarDate(2023, 1, 10)), true)

    const today = date.getTodayDate('UTC')
    equal(today instanceof peer.CalendarDate, true)
    equal(today.toString(), '2024-03-10')
    equal(date.getTodayDate().toString(), '2024-03-10')
    const converted = date.setCalendar(today, new peer.GregorianCalendar())
    equal(converted instanceof peer.CalendarDateTime, true)
    equal(converted.toString(), '2024-03-10T00:00:00')
    const minimum = new peer.CalendarDateTime(2024, 3, 12, 9)
    const maximum = new peer.CalendarDateTime(2024, 3, 14, 18)
    const constrained = date.constrainValue(today, minimum, maximum)
    equal(constrained instanceof peer.CalendarDate, true)
    equal(constrained.toString(), '2024-03-12')
    equal(date.constrainValue(today.add({ days: 10 }), minimum, maximum).toString(), '2024-03-14')
    equal(date.alignStart(today, { months: 1 }, 'en-US').toString(), '2024-03-01')
    equal(date.alignStart(today, { years: 1 }, 'en-US').toString(), '2024-01-01')

    // Both supported peers must preserve locale defaults and numeric weekday overrides.
    equal(date.getStartOfWeek(today, 'en-US').toString(), '2024-03-10')
    equal(date.getEndOfWeek(today, 'en-US').toString(), '2024-03-16')
    const month = date.getMonthDays(new peer.CalendarDate(2023, 10, 1), 'en-US')
    equal(month.length, 5)
    equal(month.map(week => week.length), [7, 7, 7, 7, 7])
    equal(month[0][0].toString(), '2023-10-01')
    equal(month[4][6].toString(), '2023-11-04')
    const wednesday = new peer.CalendarDate(2024, 8, 21)
    equal(date.getStartOfWeek(wednesday, 'en-US', 1).toString(), '2024-08-19')
    equal(date.getStartOfWeek(wednesday, 'en-US', 6).toString(), '2024-08-17')
    equal(date.getEndOfWeek(wednesday, 'en-US', 1).toString(), '2024-08-25')
    equal(date.getEndOfWeek(wednesday, 'en-GB').toString(), '2024-08-24')
    const mondayMonth = date.getMonthDays(new peer.CalendarDate(2023, 10, 1), 'en-US', undefined, 1)
    equal(mondayMonth[0][0].toString(), '2023-09-25')
    equal(mondayMonth.length, 6)
    const newYear = new peer.CalendarDate(2024, 1, 1)
    equal(date.getStartOfWeek(newYear, 'en-US', 6).toString(), '2023-12-30')
    equal(date.getEndOfWeek(newYear, 'en-US', 6).toString(), '2024-01-05')
    const japaneseDate = peer.toCalendar(new peer.CalendarDate(2019, 5, 1), new peer.JapaneseCalendar())
    const eraStart = date.getStartOfWeek(japaneseDate, 'en-US', 1)
    equal(eraStart.calendar.identifier, 'japanese')
    equal(eraStart.era, 'heisei')
    equal(eraStart.toString(), '2019-04-29')
    // Preserve upstream start-then-add semantics when the intermediate start clamps or crosses a DST gap.
    const minimumDate = new peer.CalendarDate('BC', 9999, 1, 1)
    const minimumEnd = date.getEndOfWeek(minimumDate, 'en-US', 0)
    equal([minimumEnd.era, minimumEnd.year, minimumEnd.month, minimumEnd.day], ['BC', 9999, 1, 7])
    const gapWeek = peer.toZoned(new peer.CalendarDateTime(2024, 3, 13, 2, 30), 'America/New_York')
    equal(date.getEndOfWeek(gapWeek, 'en-US', 0).toString(), '2024-03-16T03:30:00-04:00[America/New_York]')
    const weekdays = date.getWeekDays(today, undefined, 'UTC', 'en-US')
    equal(weekdays.map(day => day.long), ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
    equal(date.getSectionStart(today.add({ days: 2 }), today, { weeks: 1 }, 'en-US').focusedDate.toString(), '2024-03-10')
    equal(date.getSectionEnd(today.add({ days: 2 }), today, { weeks: 1 }, 'en-US').focusedDate.toString(), '2024-03-16')
    for (const [preset, expected] of [
      ['thisWeek', ['2024-03-10', '2024-03-16']],
      ['lastMonth', ['2024-02-01', '2024-02-29']],
      ['lastYear', ['2023-01-01', '2023-12-31']],
    ]) {
      equal(date.getDateRangePreset(preset, 'en-US', 'UTC').map(value => value.toString().slice(0, 10)), expected)
    }
    for (const name of ['CalendarDate', 'DateFormatter', 'endOfMonth', 'endOfWeek', 'endOfYear', 'getDayOfWeek', 'getLocalTimeZone', 'getWeeksInMonth', 'isSameDay', 'maxDate', 'minDate', 'now', 'startOfMonth', 'startOfWeek', 'startOfYear', 'toCalendar', 'toCalendarDate', 'toCalendarDateTime', 'today'])
      equal(Object.hasOwn(date, name), false, `${name}: private bridge binding must not become public`)
  }
  finally {
    globalThis.Date = NativeDate
  }
  return parserAssertions
}
