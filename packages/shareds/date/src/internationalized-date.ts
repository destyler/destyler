import * as dateModule from '@internationalized/date'

// Older supported peers expose their runtime API through the CommonJS default.
// Resolve each binding separately so bundlers can drop unused peer exports.
const optionalDefault = (dateModule as typeof dateModule & { default?: typeof dateModule }).default

export const CalendarDate: typeof dateModule.CalendarDate = dateModule.CalendarDate ?? optionalDefault?.CalendarDate
export const DateFormatter: typeof dateModule.DateFormatter = dateModule.DateFormatter ?? optionalDefault?.DateFormatter
export const endOfMonth: typeof dateModule.endOfMonth = dateModule.endOfMonth ?? optionalDefault?.endOfMonth
export const endOfWeek: typeof dateModule.endOfWeek = dateModule.endOfWeek ?? optionalDefault?.endOfWeek
export const endOfYear: typeof dateModule.endOfYear = dateModule.endOfYear ?? optionalDefault?.endOfYear
export const getLocalTimeZone: typeof dateModule.getLocalTimeZone = dateModule.getLocalTimeZone ?? optionalDefault?.getLocalTimeZone
export const getWeeksInMonth: typeof dateModule.getWeeksInMonth = dateModule.getWeeksInMonth ?? optionalDefault?.getWeeksInMonth
export const isSameDay: typeof dateModule.isSameDay = dateModule.isSameDay ?? optionalDefault?.isSameDay
export const maxDate: typeof dateModule.maxDate = dateModule.maxDate ?? optionalDefault?.maxDate
export const minDate: typeof dateModule.minDate = dateModule.minDate ?? optionalDefault?.minDate
export const now: typeof dateModule.now = dateModule.now ?? optionalDefault?.now
export const startOfMonth: typeof dateModule.startOfMonth = dateModule.startOfMonth ?? optionalDefault?.startOfMonth
export const startOfWeek: typeof dateModule.startOfWeek = dateModule.startOfWeek ?? optionalDefault?.startOfWeek
export const startOfYear: typeof dateModule.startOfYear = dateModule.startOfYear ?? optionalDefault?.startOfYear
export const toCalendar: typeof dateModule.toCalendar = dateModule.toCalendar ?? optionalDefault?.toCalendar
export const toCalendarDate: typeof dateModule.toCalendarDate = dateModule.toCalendarDate ?? optionalDefault?.toCalendarDate
export const toCalendarDateTime: typeof dateModule.toCalendarDateTime = dateModule.toCalendarDateTime ?? optionalDefault?.toCalendarDateTime
export const today: typeof dateModule.today = dateModule.today ?? optionalDefault?.today
