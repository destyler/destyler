import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, nextTick, withKeys } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, isSameDay, isSameMonth, isToday } from '@internationalized/date'
import { parseStringToDateValue, toDate } from '@destyler/shared'
import { useForwardExpose, useKbd } from '@destyler/composition'

import { injectCalendarRootContext } from './root'

export const destylerCalendarCellTriggerProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  day: {
    type: Object as PropType<DateValue>,
    required: true,
  },
  month: {
    type: Object as PropType<DateValue>,
    required: true,
  },
} as const

export type DestylerCalendarCellTriggerProps = ExtractPublicPropTypes<typeof destylerCalendarCellTriggerProps>

export const DestylerCalendarCellTrigger = defineComponent({
  name: 'DestylerCalendarCellTrigger',
  props: destylerCalendarCellTriggerProps,
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
      return isSameDay(props.day, rootContext.defaultDate)
    })

    const isSelectedDate = computed(() => rootContext.isDateSelected(props.day))

    const SELECTOR = '[data-destyler-calendar-cell-trigger]:not([data-disabled]):not([data-outside-month]):not([data-outside-visible-months])'

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
          rootContext.defaultDate,
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
      switch (e.code) {
        case kbd.ARROW_RIGHT:
          newIndex++
          break
        case kbd.ARROW_LEFT:
          newIndex--
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
              rootContext.defaultDate,
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
    const formattedTriggerText = computed(() => {
      return rootContext.formatter.custom(props.day.toDate(getLocalTimeZone()), {
        day: 'numeric',
      })
    })

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
      formattedTriggerText,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      'ref': (el: any) => this.forwardRef(el),
      'data-destyler-calendar-cell-trigger': '',
      'role': 'button',
      'aria-label': this.labelText,
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
    }, {
      default: () => this.$slots.default ? this.$slots.default?.() : this.formattedTriggerText,
    })
  },
})
