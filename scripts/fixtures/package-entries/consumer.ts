import type { Context as NavigationContext, ValueChangeDetails } from '@destyler/navigation-menu'
import type { ScrollChangeDetails, Context as ScrollContext, VirtualItem } from '@destyler/scroll-area'
import type { CalendarDate, CalendarDateTime, DateFormatter, DateValue } from '@internationalized/date'
import { getDayFormatter, getTodayDate, parseDateString, setCalendar } from '@destyler/date'
import { machine as navigationMachine } from '@destyler/navigation-menu'
import { machine as scrollMachine } from '@destyler/scroll-area'

const navigation: NavigationContext = { id: 'navigation', defaultValue: 'products' }
const scroll: ScrollContext = { id: 'scroll', type: 'hover' }
navigationMachine(navigation)
scrollMachine(scroll)

const value: ValueChangeDetails = { value: null }
const offset: ScrollChangeDetails = {
  scrollTop: 1,
  scrollLeft: 2,
  scrollHeight: 100,
  scrollWidth: 100,
  clientHeight: 50,
  clientWidth: 50,
}
const item: VirtualItem = { index: 0, start: 0, end: 30, size: 30 }
void [value, offset, item]

// @ts-expect-error the public navigation value must be a string or null
navigationMachine({ id: 'invalid-navigation', value: 123 })
// @ts-expect-error invalid scroll visibility must not degrade into an untyped import
scrollMachine({ id: 'invalid-scroll', type: 'sometimes' })

const parsed = parseDateString('2024-02-29', 'ja-JP', 'UTC')
const parsedDate: DateValue | undefined = parsed
const today = getTodayDate('UTC')
const calendarDate: CalendarDate = today
const formatter = getDayFormatter('en-US', 'UTC')
const dateFormatter: DateFormatter = formatter
const converted = setCalendar(today, today.calendar)
const calendarDateTime: CalendarDateTime = converted
void [parsedDate, calendarDate, dateFormatter, calendarDateTime]

// @ts-expect-error parsing accepts a string, not a numeric date
parseDateString(20240229, 'en-US', 'UTC')
// @ts-expect-error the parsed return must not degrade into any
const invalidParsed: number = parsed
// @ts-expect-error the inferred CalendarDate return must not degrade into any
const invalidToday: number = today
// @ts-expect-error the inferred DateFormatter return must not degrade into any
const invalidFormatter: number = formatter
// @ts-expect-error the inferred CalendarDateTime return must not degrade into any
const invalidCalendar: number = converted
void [invalidParsed, invalidToday, invalidFormatter, invalidCalendar]
