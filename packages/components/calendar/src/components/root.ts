import type { Component, PropType, Ref } from 'vue'
import { computed, defineComponent, h, onMounted, ref, toRefs } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import type { AsTag } from '@destyler/primitive'
import type { CalendarHeadingSegmentValue, CalendarView, ExtractPublicPropTypes, Matcher, WeekDayFormat } from '@destyler/shared'
import { createContext, getDefaultDate, handleCalendarInitialFocus } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'
import type { Formatter } from '@destyler/composition'
import { isSameDay } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

import { useCalendar, useCalendarState } from '../composition/useCalendar'

export const destylerCalendarRootProps = {
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
  defaultValue: {
    type: Object as PropType<DateValue>,
    required: false,
    default: undefined,
  },
  initialView: {
    type: String as PropType<CalendarView>,
    required: false,
    default: 'month',
  },
  columns: {
    type: Number as PropType<number>,
    required: false,
    default: 4,
  },
  placeholder: {
    type: Object as PropType<DateValue>,
    required: false,
    default: undefined,
  },
  pagedNavigation: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  preventDeselect: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  weekStartsOn: {
    type: Number as PropType<0 | 1 | 2 | 3 | 4 | 5 | 6>,
    required: false,
    default: 0,
  },
  weekdayFormat: {
    type: String as PropType<WeekDayFormat>,
    required: false,
    default: 'narrow',
  },
  calendarLabel: {
    type: String as PropType<string>,
    required: false,
  },
  fixedWeeks: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  maxValue: {
    type: Object as PropType<DateValue>,
    required: false,
  },
  minValue: {
    type: Object as PropType<DateValue>,
    required: false,
  },
  locale: {
    type: String as PropType<string>,
    required: false,
    default: 'en',
  },
  numberOfMonths: {
    type: Number as PropType<number>,
    required: false,
    default: 1,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  readonly: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  initialFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  isDateDisabled: {
    type: Function as PropType<Matcher>,
    required: false,
    default: undefined,
  },
  isDateUnavailable: {
    type: Function as PropType<Matcher>,
    required: false,
    default: undefined,
  },
  modelValue: {
    type: [Object, Array] as PropType<DateValue | DateValue[]>,
    required: false,
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerCalendarRootProps = ExtractPublicPropTypes<typeof destylerCalendarRootProps>

export interface CalendarRootContext {
  calendarView: Ref<CalendarView>
  locale: Ref<string>
  modelValue: Ref<DateValue | DateValue[] | undefined>
  placeholder: Ref<DateValue>
  pagedNavigation: Ref<boolean>
  preventDeselect: Ref<boolean>
  weekStartsOn: Ref<0 | 1 | 2 | 3 | 4 | 5 | 6>
  weekdayFormat: Ref<WeekDayFormat>
  fixedWeeks: Ref<boolean>
  multiple: Ref<boolean>
  numberOfMonths: Ref<number>
  disabled: Ref<boolean>
  readonly: Ref<boolean>
  initialFocus: Ref<boolean>
  onDateChange: (date: DateValue) => void
  onPlaceholderChange: (date: DateValue) => void
  fullCalendarLabel: Ref<string>
  parentElement: Ref<HTMLElement | undefined>
  headingValue: Ref<CalendarHeadingSegmentValue[]>
  isInvalid: Ref<boolean>
  nextPage: () => void
  prevPage: () => void
  isDateDisabled: Matcher
  isDateSelected: Matcher
  isDateUnavailable?: Matcher
  isOutsideVisibleView: (date: DateValue) => boolean
  isNextButtonDisabled: Ref<boolean>
  isPrevButtonDisabled: Ref<boolean>
  formatter: Formatter
  columns: Ref<number>
  setView: (view: CalendarView) => void
}

export const [injectCalendarRootContext, provideCalendarRootContext]
  = createContext<CalendarRootContext>('DestylerCalendarRoot')

export const DestylerCalendarRoot = defineComponent({
  name: 'DestylerCalendarRoot',
  props: destylerCalendarRootProps,
  emits: ['update:modelValue', 'update:placeholder'],
  setup(props, { emit }) {
    const {
      locale,
      disabled,
      readonly,
      initialFocus,
      pagedNavigation,
      weekStartsOn,
      weekdayFormat,
      fixedWeeks,
      multiple,
      numberOfMonths,
      preventDeselect,
      isDateDisabled: propsIsDateDisabled,
      isDateUnavailable: propsIsDateUnavailable,
      columns,
      calendarLabel,
    } = toRefs(props)

    const calendarView = ref(props.initialView)

    const { forwardRef, currentElement: parentElement } = useForwardExpose()

    const computedModelDefault = computed(() => {
      if (multiple.value)
        return props.defaultValue ? [props.defaultValue] : []
      return props.defaultValue ?? undefined
    })

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: computedModelDefault.value,
      passive: (props.modelValue === undefined) as false,
    }) as Ref<DateValue | DateValue[] | undefined>

    const defaultDate = getDefaultDate({
      defaultPlaceholder: props.placeholder,
      defaultValue: props.modelValue,
    })

    const placeholder = useVModel(props, 'placeholder', emit, {
      defaultValue: defaultDate,
      passive: (props.placeholder === undefined) as false,
    }) as Ref<DateValue>

    const {
      isDateDisabled,
      isDateUnavailable,
      isNextButtonDisabled,
      isPrevButtonDisabled,
      weekdays,
      isOutsideVisibleView,
      nextPage,
      prevPage,
      formatter,
      grid,
    } = useCalendar({
      columns,
      locale: props.locale,
      placeholder,
      weekStartsOn: props.weekStartsOn,
      fixedWeeks: props.fixedWeeks,
      numberOfMonths: props.numberOfMonths,
      minValue: props.minValue,
      maxValue: props.maxValue,
      disabled: props.disabled,
      weekdayFormat: props.weekdayFormat,
      pagedNavigation: props.pagedNavigation,
      isDateDisabled: propsIsDateDisabled.value,
      isDateUnavailable: propsIsDateUnavailable.value,
      calendarView,
    })

    const {
      fullCalendarLabel,
      headingValue,
      isInvalid,
      isDateSelected,
    } = useCalendarState({
      date: modelValue,
      formatter,
      grid,
      calendarView,
      isDateDisabled,
      isDateUnavailable,
      locale: locale.value,
      calendarLabel: calendarLabel.value,
    })

    function onDateChange(value: DateValue) {
      if (!multiple.value) {
        if (!modelValue.value) {
          modelValue.value = placeholder.value.set({ ...value })
          return
        }

        if (isSameDay(modelValue.value as DateValue, value)) {
          placeholder.value = placeholder.value.set({ ...value })
          modelValue.value = undefined
        }
        else {
          modelValue.value = placeholder.value.set({ ...value })
        }
      }
      else if (Array.isArray(modelValue.value)) {
        if (!modelValue.value) {
          modelValue.value = [placeholder.value.set({ ...value })]
          return
        }

        const index = modelValue.value.findIndex(date => isSameDay(date, value))
        if (index === -1) {
          modelValue.value = [...modelValue.value, value]
        }
        else {
          const next = modelValue.value.filter(date => !isSameDay(date, value))
          if (!next.length) {
            placeholder.value = placeholder.value.set({ ...value })
            modelValue.value = []
            return
          }
          modelValue.value = next.map(date => placeholder.value.set({ ...date }))
        }
      }
    }

    onMounted(() => {
      if (initialFocus.value)
        handleCalendarInitialFocus(parentElement.value)
    })

    provideCalendarRootContext({
      calendarView,
      isDateUnavailable,
      isDateDisabled,
      locale,
      formatter,
      modelValue,
      placeholder,
      disabled,
      initialFocus,
      pagedNavigation,
      weekStartsOn,
      weekdayFormat,
      fixedWeeks,
      multiple,
      numberOfMonths,
      readonly,
      preventDeselect,
      fullCalendarLabel,
      headingValue,
      isInvalid,
      isDateSelected,
      isNextButtonDisabled,
      isPrevButtonDisabled,
      isOutsideVisibleView,
      nextPage,
      prevPage,
      parentElement,
      columns,
      onPlaceholderChange(value) {
        placeholder.value = value
      },
      setView(view) {
        calendarView.value = view
      },
      onDateChange,
    })

    return {
      forwardRef,
      weekdays,
      fullCalendarLabel,
      readonly,
      disabled,
      isInvalid,
      calendarView,
      grid,
      placeholder,
      formatter,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      'ref': (el: any) => this.forwardRef(el),
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'role': 'application',
      'aria-label': this.fullCalendarLabel,
      'data-readonly': this.readonly ? '' : undefined,
      'data-disabled': this.disabled ? '' : undefined,
      'data-invalid': this.isInvalid ? '' : undefined,
      'data-destyler-calendar-view': this.calendarView,
    }, {
      default: () => {
        return [
          h('div', {
            style: {
              'border': '0px',
              'clip': 'rect(0px, 0px, 0px, 0px)',
              'clip-path': 'inset(50%)',
              'height': '1px',
              'margin': '-1px',
              'overflow': 'hidden',
              'padding': '0px',
              'position': 'absolute',
              'white-space': 'nowrap',
              'width': '1px',
            },
          }, {
            default: () => {
              return h('div', {
                'role': 'heading',
                'aria-level': '2',
              }, {
                default: () => this.fullCalendarLabel,
              })
            },
          }),
          this.$slots.default?.({
            date: this.placeholder,
            grid: this.grid,
            calendarView: this.calendarView,
            weekDays: this.weekdays,
            formatter: this.formatter,
          }),
        ]
      },
    })
  },
})
