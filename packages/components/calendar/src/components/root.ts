import type { Component, PropType, Ref } from 'vue'
import { computed, defineComponent, h, onMounted, toRefs, watch } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes, Matcher, SupportedLocale, WeekDayFormat } from '@destyler/shared'
import { createContext, createDecade, createYear, getDefaultDate, handleCalendarInitialFocus } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'
import type { Formatter } from '@destyler/composition'
import { isSameDay } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

import { useCalendar, useCalendarState } from '../composition/use-calendar'

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
  defaultPlaceholder: {
    type: Object as PropType<DateValue>,
    required: false,
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
    type: String as PropType<SupportedLocale>,
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
    type: [Object, Array] as PropType<DateValue | DateValue[] | undefined>,
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
  locale: Ref<SupportedLocale>
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
  headingValue: Ref<string>
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
  defaultDate: DateValue
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
      minValue,
      maxValue,
      numberOfMonths,
      preventDeselect,
      isDateDisabled: propsIsDateDisabled,
      isDateUnavailable: propsIsDateUnavailable,
      calendarLabel,
    } = toRefs(props)

    const { forwardRef, currentElement: parentElement } = useForwardExpose()

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? undefined,
      passive: (props.modelValue === undefined) as false,
    }) as Ref<DateValue | DateValue[] | undefined>

    const defaultDate = getDefaultDate({
      defaultPlaceholder: props.placeholder,
      defaultValue: modelValue.value,
    })

    const placeholder = useVModel(props, 'placeholder', emit, {
      defaultValue: props.defaultPlaceholder ?? defaultDate.copy(),
      passive: (props.placeholder === undefined) as false,
    }) as Ref<DateValue>

    function onPlaceholderChange(value: DateValue) {
      const dateRef = defaultDate.set({ ...placeholder.value })
      placeholder.value = dateRef.set({ ...value })
    }

    const {
      fullCalendarLabel,
      headingValue,
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
      locale: props.locale,
      placeholder,
      weekStartsOn: props.weekStartsOn,
      fixedWeeks: props.fixedWeeks,
      numberOfMonths: props.numberOfMonths,
      minValue,
      maxValue,
      disabled,
      weekdayFormat: props.weekdayFormat,
      pagedNavigation: props.pagedNavigation,
      isDateDisabled: propsIsDateDisabled.value,
      isDateUnavailable: propsIsDateUnavailable.value,
      calendarLabel: calendarLabel.value,
    })

    const {
      isInvalid,
      isDateSelected,
    } = useCalendarState({
      date: modelValue,
      grid,
      isDateDisabled,
      isDateUnavailable,
    })

    watch(modelValue, (value) => {
      if (Array.isArray(value) && value.length) {
        const lastValue = value[value.length - 1]
        if (lastValue && placeholder.value.toString() !== lastValue.toString())
          onPlaceholderChange(lastValue)
      }
      else if (!Array.isArray(value) && value && placeholder.toString() !== value.toString()) {
        onPlaceholderChange(value)
      }
    })

    function onDateChange(value: DateValue) {
      const dateRef = defaultDate
      if (!multiple.value) {
        if (!modelValue.value) {
          modelValue.value = dateRef.set({ ...value })
          return
        }

        if (!preventDeselect.value && isSameDay(modelValue.value as DateValue, value))
          modelValue.value = undefined
        else
          modelValue.value = dateRef.set({ ...value })
      }
      else if (Array.isArray(modelValue.value)) {
        if (!modelValue.value) {
          modelValue.value = [dateRef.set({ ...value })]

          return
        }

        const index = modelValue.value.findIndex(date => isSameDay(date, value))
        if (index === -1) {
          modelValue.value = [...modelValue.value, value]
        }
        else if (!preventDeselect.value) {
          const next = modelValue.value.filter(date => !isSameDay(date, value))
          if (!next.length) {
            modelValue.value = []
            return
          }
          modelValue.value = next.map(date => dateRef.set({ ...date }))
        }
      }
    }

    const getMonths = computed(() => {
      const dateObj = defaultDate.set({ ...placeholder.value })
      return createYear({
        dateObj,
        maxValue: defaultDate.set({ ...minValue.value }),
        minValue: defaultDate.set({ ...maxValue.value }),
        numberOfMonths: numberOfMonths.value,
        pagedNavigation: pagedNavigation.value,
      })
    })

    function getYears({ startIndex, endIndex }: { startIndex?: number, endIndex: number }) {
      const dateObj = defaultDate
      return createDecade({
        dateObj,
        startIndex,
        endIndex,
        maxValue: defaultDate.set({ ...minValue.value }),
        minValue: defaultDate.set({ ...maxValue.value }),
      })
    }

    onMounted(() => {
      if (initialFocus.value)
        handleCalendarInitialFocus(parentElement.value)
    })

    provideCalendarRootContext({
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
      onPlaceholderChange,
      onDateChange,
      defaultDate,
    })

    return {
      forwardRef,
      getYears,
      getMonths,
      weekdays,
      fullCalendarLabel,
      readonly,
      disabled,
      isInvalid,
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
            weekDays: this.weekdays,
            formatter: this.formatter,
            getMonths: this.getMonths,
            getYears: this.getYears,
          }),
        ]
      },
    })
  },
})
