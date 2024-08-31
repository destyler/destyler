import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps, nextTick, withKeys } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, isSameDay, isSameMonth, isToday } from '@internationalized/date'
import { parseStringToDateValue, toDate } from '@destyler/shared'
import { useForwardExpose, useKbd } from '@destyler/composition'

import { injectCalendarRootContext } from './root'

export const calendarCellTriggerProps = {
  ...primitiveProps,
  day: {
    type: Object as PropType<DateValue>,
    required: true,
  },
  month: {
    type: Object as PropType<DateValue>,
    required: true,
  },
} as const

export type CalendarCellTriggerProps = ExtractPublicPropTypes<typeof calendarCellTriggerProps>

export const CalendarCellTrigger = defineComponent({
  name: 'DestylerCalendarCellTrigger',
  props: calendarCellTriggerProps,

  setup(props) {
    const kbd = useKbd()
    const rootContext = injectCalendarRootContext()

    const { forwardRef, currentElement } = useForwardExpose()

    const labelText = computed(() => {
      return rootContext.formatter.custom(toDate(props.day), {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    })

    const isDisabled = computed(() => rootContext.isDateDisabled(props.day))
    const isUnavailable = computed(() =>
      rootContext.isDateUnavailable?.(props.day),
    )
    const isDateToday = computed(() => {
      return isToday(props.day, getLocalTimeZone())
    })
    const isOutsideView = computed(() => {
      return !isSameMonth(props.day, props.month)
    })
    const isOutsideVisibleView = computed(() =>
      rootContext.isOutsideVisibleView(props.day),
    )

    const isFocusedDate = computed(() => {
      return isSameDay(props.day, rootContext.placeholder.value)
    })
    const isSelectedDate = computed(() => rootContext.isDateSelected(props.day))

    const SELECTOR
      = '[data-destyler-calendar-cell-trigger]:not([data-disabled]):not([data-outside-month]):not([data-outside-visible-months])'

    function changeDate(date: DateValue) {
      if (rootContext.readonly.value)
        return
      if (rootContext.isDateDisabled(date) || rootContext.isDateUnavailable?.(date))
        return

      rootContext.onDateChange(date)
    }

    function handleClick(e: Event) {
      changeDate(
        parseStringToDateValue(
          (e.target as HTMLDivElement).getAttribute('data-value')!,
          rootContext.placeholder.value,
        ),
      )
    }

    function handleArrowKey(e: KeyboardEvent) {
      const currentCell = e.target as HTMLDivElement
      e.preventDefault()
      e.stopPropagation()
      const parentElement = rootContext.parentElement.value!
      const allCollectionItems: HTMLElement[] = parentElement
        ? Array.from(parentElement.querySelectorAll(SELECTOR))
        : []
      const index = allCollectionItems.indexOf(currentElement.value)
      let newIndex = index
      const indexIncrementation = 7
      const sign = rootContext.dir.value === 'rtl' ? -1 : 1
      switch (e.code) {
        case kbd.ARROW_RIGHT:
          newIndex += sign
          break
        case kbd.ARROW_LEFT:
          newIndex -= sign
          break
        case kbd.ARROW_UP:
          newIndex -= indexIncrementation
          break
        case kbd.ARROW_DOWN:
          newIndex += indexIncrementation
          break
        case kbd.ENTER:
        case kbd.SPACE_CODE:
          changeDate(
            parseStringToDateValue(
              currentCell!.getAttribute('data-value')!,
              rootContext.placeholder.value,
            ),
          )
          return
        default:
          return
      }

      if (newIndex >= 0 && newIndex < allCollectionItems.length) {
        allCollectionItems[newIndex].focus()
        return
      }

      if (newIndex < 0) {
        if (rootContext.isPrevButtonDisabled.value)
          return
        rootContext.prevPage()
        nextTick(() => {
          const newCollectionItems: HTMLElement[] = parentElement
            ? Array.from(parentElement.querySelectorAll(SELECTOR))
            : []
          newCollectionItems[
            newCollectionItems.length - Math.abs(newIndex)
          ].focus()
        })
        return
      }

      if (newIndex >= allCollectionItems.length) {
        if (rootContext.isNextButtonDisabled.value)
          return
        rootContext.nextPage()
        nextTick(() => {
          const newCollectionItems: HTMLElement[] = parentElement
            ? Array.from(parentElement.querySelectorAll(SELECTOR))
            : []
          newCollectionItems[newIndex - allCollectionItems.length].focus()
        })
      }
    }

    return {
      handleClick,
      handleArrowKey,
      forwardRef,
      labelText,
      isOutsideView,
      isDisabled,
      isUnavailable,
      isSelectedDate,
      isDateToday,
      isOutsideVisibleView,
      isFocusedDate,
      rootContext,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'ref': (el: any) => this.forwardRef(el),
      'role': 'button',
      'aria-label': this.labelText,
      'data-destyler-calendar-cell-trigger': '',
      'aria-disabled': this.isOutsideView || this.isDisabled || this.isUnavailable ? true : undefined,
      'data-selected': this.isSelectedDate ? true : undefined,
      'data-value': this.$props.day.toString(),
      'data-disabled': this.isDisabled || this.isOutsideView ? '' : undefined,
      'data-unavailable': this.isUnavailable ? '' : undefined,
      'data-today': this.isDateToday ? '' : undefined,
      'data-outside-view': this.isOutsideView ? '' : undefined,
      'data-outside-visible-view': this.isOutsideVisibleView ? '' : undefined,
      'data-focused': this.isFocusedDate ? '' : undefined,
      'tabindex': this.isFocusedDate ? 0 : this.isOutsideView || this.isDisabled ? undefined : -1,
      'onClick': (event: any) => {
        this.handleClick(event)
      },
      'onKeydown': withKeys((event: any) => {
        if (event.key === 'Enter')
          event.preventDefault()

        this.handleArrowKey(event)
      }, ['up', 'down', 'left', 'right', 'space', 'enter']),
    }), {
      default: () => this.$slots.default ? this.$slots.default?.() : this.$props.day.day.toLocaleString(this.rootContext.locale.value),
    })
  },
})
