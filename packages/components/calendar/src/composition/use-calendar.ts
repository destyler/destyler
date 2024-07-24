/*
 * Adapted from https://github.com/melt-ui/melt-ui/blob/develop/src/lib/builders/calendar/create.ts
 */

import { type DateValue, isSameDay, isSameMonth } from '@internationalized/date'
import { type Ref, computed, ref, watch } from 'vue'
import { useDateFormatter } from '@destyler/composition'
import { type Grid, type Matcher, type WeekDayFormat, createMonths, isAfter, isBefore, toDate } from '@destyler/shared'

export interface UseCalendarProps {
  locale: Ref<string>
  placeholder: Ref<DateValue>
  weekStartsOn: Ref<0 | 1 | 2 | 3 | 4 | 5 | 6>
  fixedWeeks: Ref<boolean>
  numberOfMonths: Ref<number>
  minValue: Ref<DateValue | undefined>
  maxValue: Ref<DateValue | undefined>
  disabled: Ref<boolean>
  weekdayFormat: Ref<WeekDayFormat>
  pagedNavigation: Ref<boolean>
  isDateDisabled?: Matcher
  isDateUnavailable?: Matcher
  calendarLabel: Ref<string | undefined>
}

export interface UseCalendarStateProps {
  isDateDisabled: Matcher
  isDateUnavailable: Matcher
  date: Ref<DateValue | DateValue[] | undefined>
}

export function useCalendarState(props: UseCalendarStateProps) {
  function isDateSelected(dateObj: DateValue) {
    if (Array.isArray(props.date.value))
      return props.date.value.some(d => isSameDay(d, dateObj))

    else if (!props.date.value)
      return false

    else
      return isSameDay(props.date.value, dateObj)
  }

  const isInvalid = computed(
    () => {
      if (Array.isArray(props.date.value)) {
        if (!props.date.value.length)
          return false
        for (const dateObj of props.date.value) {
          if (props.isDateDisabled?.(dateObj))
            return true
          if (props.isDateUnavailable?.(dateObj))
            return true
        }
      }
      else {
        if (!props.date.value)
          return false
        if (props.isDateDisabled?.(props.date.value))
          return true
        if (props.isDateUnavailable?.(props.date.value))
          return true
      }
      return false
    },
  )

  return {
    isDateSelected,
    isInvalid,
  }
}

export function useCalendar(props: UseCalendarProps) {
  const formatter = useDateFormatter(props.locale.value)

  const grid = ref<Grid<DateValue>[]>(createMonths({
    dateObj: props.placeholder.value,
    weekStartsOn: props.weekStartsOn.value,
    locale: props.locale.value,
    fixedWeeks: props.fixedWeeks.value,
    numberOfMonths: props.numberOfMonths.value,
  })) as Ref<Grid<DateValue>[]>

  const visibleView = computed(() => {
    return grid.value.map(month => month.value)
  })

  function isOutsideVisibleView(date: DateValue) {
    return !visibleView.value.some(month => isSameMonth(date, month))
  }

  const isNextButtonDisabled = computed(() => {
    if (!props.maxValue.value || !grid.value.length)
      return false
    if (props.disabled.value)
      return true
    const lastPeriodInView = grid.value[grid.value.length - 1].value

    const firstPeriodOfNextPage = lastPeriodInView.add({ months: 1 }).set({ day: 1 })
    return isAfter(firstPeriodOfNextPage, props.maxValue.value)
  })

  const isPrevButtonDisabled = computed(() => {
    if (!props.minValue.value || !grid.value.length)
      return false
    if (props.disabled.value)
      return true
    const firstPeriodInView = grid.value[0].value
    const lastPeriodOfPrevPage = firstPeriodInView.subtract({ months: 1 }).set({ day: 35 })
    return isBefore(lastPeriodOfPrevPage, props.minValue.value)
  })

  function isDateDisabled(dateObj: DateValue) {
    if (props.isDateDisabled?.(dateObj) || props.disabled.value)
      return true
    if (props.maxValue.value && isAfter(dateObj, props.maxValue.value))
      return true
    if (props.minValue.value && isBefore(dateObj, props.minValue.value))
      return true
    return false
  }

  const isDateUnavailable = (date: DateValue) => {
    if (props.isDateUnavailable?.(date))
      return true
    return false
  }

  const weekdays = computed(() => {
    if (!grid.value.length)
      return []
    return grid.value[0].rows[0].map((date) => {
      return formatter.dayOfWeek(toDate(date), props.weekdayFormat.value)
    })
  })

  const nextPage = () => {
    const firstDate = grid.value[0].value

    const newGrid = createMonths({
      dateObj: firstDate.add({ months: props.pagedNavigation.value ? props.numberOfMonths.value : 1 }),
      weekStartsOn: props.weekStartsOn.value,
      locale: props.locale.value,
      fixedWeeks: props.fixedWeeks.value,
      numberOfMonths: props.numberOfMonths.value,
    })

    grid.value = newGrid

    props.placeholder.value = newGrid[0].value.set({ day: 1 })
  }

  const prevPage = () => {
    const firstDate = grid.value[0].value

    const newGrid = createMonths({
      dateObj: firstDate.subtract({ months: props.pagedNavigation.value ? props.numberOfMonths.value : 1 }),
      weekStartsOn: props.weekStartsOn.value,
      locale: props.locale.value,
      fixedWeeks: props.fixedWeeks.value,
      numberOfMonths: props.numberOfMonths.value,
    })

    props.placeholder.value = newGrid[0].value.set({ day: 1 })
  }

  watch(props.placeholder, (value) => {
    if (visibleView.value.some(month => isSameMonth(month, value)))
      return
    grid.value = createMonths({
      dateObj: value,
      weekStartsOn: props.weekStartsOn.value,
      locale: props.locale.value,
      fixedWeeks: props.fixedWeeks.value,
      numberOfMonths: props.numberOfMonths.value,
    })
  })

  watch([props.locale, props.weekStartsOn, props.fixedWeeks, props.numberOfMonths], () => {
    grid.value = createMonths({
      dateObj: props.placeholder.value,
      weekStartsOn: props.weekStartsOn.value,
      locale: props.locale.value,
      fixedWeeks: props.fixedWeeks.value,
      numberOfMonths: props.numberOfMonths.value,
    })
  })

  const headingValue = computed(() => {
    if (!grid.value.length)
      return ''

    if (props.locale.value !== formatter.getLocale())
      formatter.setLocale(props.locale.value)

    if (grid.value.length === 1) {
      const month = grid.value[0].value
      return `${formatter.fullMonthAndYear(toDate(month))}`
    }

    const startMonth = toDate(grid.value[0].value)
    const endMonth = toDate(grid.value[grid.value.length - 1].value)

    const startMonthName = formatter.fullMonth(startMonth)
    const endMonthName = formatter.fullMonth(endMonth)
    const startMonthYear = formatter.fullYear(startMonth)
    const endMonthYear = formatter.fullYear(endMonth)

    const content
    = startMonthYear === endMonthYear
      ? `${startMonthName} - ${endMonthName} ${endMonthYear}`
      : `${startMonthName} ${startMonthYear} - ${endMonthName} ${endMonthYear}`

    return content
  })

  const fullCalendarLabel = computed(() => `${props.calendarLabel.value ?? 'Event Date'}, ${headingValue.value}`)

  return {
    isDateDisabled,
    isDateUnavailable,
    isNextButtonDisabled,
    isPrevButtonDisabled,
    grid,
    weekdays,
    visibleView,
    isOutsideVisibleView,
    formatter,
    nextPage,
    prevPage,
    headingValue,
    fullCalendarLabel,
  }
}
