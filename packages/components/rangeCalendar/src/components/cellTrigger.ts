import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps, nextTick, withKeys } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useKbd } from '@destyler/composition'
import { isBetweenInclusive, parseStringToDateValue, toDate } from '@destyler/shared'
import { type DateValue, getLocalTimeZone, isSameDay, isSameMonth, isToday } from '@internationalized/date'

import { injectRangeCalendarRootContext } from './root'

export const rangeCalendarCellTriggerProps = {
  ...primitiveProps,
  /**
   * The date value provided to the cell trigger
   */
  day: {
    type: Object as PropType<DateValue>,
    required: true,
  },
  /**
   * The month in which the cell is rendered
   */
  month: {
    type: Object as PropType<DateValue>,
    required: true,
  },
} as const

export type RangeCalendarCellTriggerProps = ExtractPublicPropTypes<typeof rangeCalendarCellTriggerProps>

export const RangeCalendarCellTrigger = defineComponent({
  name: 'DestylerRangeCalendarCellTrigger',
  props: rangeCalendarCellTriggerProps,
  setup(props) {
    const rootContext = injectRangeCalendarRootContext()

    const kbd = useKbd()

    const { forwardRef, currentElement } = useForwardExpose()

    const labelText = computed(() => rootContext.formatter.custom(toDate(props.day), {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }))

    const isDisabled = computed(() => rootContext.isDateDisabled(props.day))
    const isUnavailable = computed(() => rootContext.isDateUnavailable?.(props.day))
    const isSelectedDate = computed(() => rootContext.isSelected(props.day))
    const isSelectionStart = computed(() => rootContext.isSelectionStart(props.day))
    const isSelectionEnd = computed(() => rootContext.isSelectionEnd(props.day))
    const isHighlighted = computed(() => rootContext.highlightedRange.value
      ? isBetweenInclusive(props.day, rootContext.highlightedRange.value.start, rootContext.highlightedRange.value.end)
      : false)

    const SELECTOR = '[data-destyler-calendar-cell-trigger]:not([data-disabled]):not([data-outside-month]):not([data-outside-visible-months])'

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

    function changeDate(date: DateValue) {
      if (rootContext.readonly.value)
        return
      if (rootContext.isDateDisabled(date) || rootContext.isDateUnavailable?.(date))
        return

      rootContext.lastPressedDateValue.value = date.copy()

      if (rootContext.startValue.value && rootContext.highlightedRange.value === null) {
        if (isSameDay(date, rootContext.startValue.value) && !rootContext.preventDeselect.value && !rootContext.endValue.value) {
          rootContext.startValue.value = undefined
          rootContext.onPlaceholderChange(date)
          return
        }
        else if (!rootContext.endValue.value) {
          if (rootContext.lastPressedDateValue.value && isSameDay(rootContext.lastPressedDateValue.value, date))
            rootContext.startValue.value = date.copy()
          return
        }
      }

      if (rootContext.startValue.value && isSameDay(rootContext.startValue.value, date) && !rootContext.preventDeselect.value && !rootContext.endValue.value) {
        rootContext.startValue.value = undefined
        rootContext.onPlaceholderChange(date)
        return
      }

      if (!rootContext.startValue.value) {
        rootContext.startValue.value = date.copy()
      }
      else if (!rootContext.endValue.value) {
        rootContext.endValue.value = date.copy()
      }
      else if (rootContext.endValue.value && rootContext.startValue.value) {
        rootContext.endValue.value = undefined
        rootContext.startValue.value = date.copy()
      }
    }

    function handleClick(e: Event) {
      const date = parseStringToDateValue((e.target as HTMLDivElement).getAttribute('data-value')!, rootContext.placeholder.value)

      if (rootContext.isDateDisabled(date) || rootContext.isDateUnavailable?.(date))
        return

      changeDate(date)
    }

    function handleFocus(e: Event) {
      const date = parseStringToDateValue((e.target as HTMLDivElement).getAttribute('data-value')!, rootContext.placeholder.value)

      if (rootContext.isDateDisabled(date) || rootContext.isDateUnavailable?.(date))
        return
      rootContext.focusedValue.value = date.copy()
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
          changeDate(parseStringToDateValue(currentCell!.getAttribute('data-value')!, rootContext.placeholder.value))
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
          newCollectionItems[newCollectionItems.length - Math.abs(newIndex)].focus()
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
      rootContext,
      labelText,
      isOutsideVisibleView,
      isSelectedDate,
      isOutsideView,
      isDisabled,
      isUnavailable,
      isHighlighted,
      isSelectionStart,
      isSelectionEnd,
      isDateToday,
      isFocusedDate,
      forwardRef,
      handleClick,
      handleFocus,
      handleArrowKey,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'ref': (el: any) => this.forwardRef(el),
      'role': 'button',
      'aria-label': this.labelText,
      'data-destyler-calendar-cell-trigger': '',
      'aria-selected': this.isSelectedDate ? true : undefined,
      'aria-disabled': this.isOutsideView || this.isDisabled || this.isUnavailable ? true : undefined,
      'data-highlighted': this.isHighlighted ? '' : undefined,
      'data-selection-start': this.isSelectionStart ? true : undefined,
      'data-selection-end': this.isSelectionEnd ? true : undefined,
      'data-selected': this.isSelectedDate ? true : undefined,
      'data-outside-visible-view': this.isOutsideVisibleView ? '' : undefined,
      'data-value': this.$props.day.toString(),
      'data-disabled': this.isDisabled || this.isOutsideView ? '' : undefined,
      'data-unavailable': this.isUnavailable ? '' : undefined,
      'data-today': this.isDateToday ? '' : undefined,
      'data-outside-month': this.isOutsideView ? '' : undefined,
      'data-focused': this.isFocusedDate ? '' : undefined,
      'tabindex': this.isFocusedDate ? 0 : this.isOutsideView || this.isDisabled ? undefined : -1,
      'onClick': (event: any) => {
        this.handleClick(event)
      },
      'onFocus': (event: any) => {
        this.handleFocus(event)
      },
      'onMouseenter': (event: any) => {
        this.handleFocus(event)
      },
      'onKeydown': withKeys((event: any) => {
        this.handleArrowKey(event)
      }, ['up', 'down', 'left', 'right', 'enter', 'space']),
    }), {
      default: () => {
        return this.$slots.default
          ? this.$slots.default?.()
          : this.$props.day.day.toLocaleString(this.rootContext.locale.value)
      },
    })
  },
})
