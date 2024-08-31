import type { PropType, Ref, SlotsType, VNode } from 'vue'
import { defineComponent, h, onMounted, toRefs, watch } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { Direction, ExtractPublicPropTypes, Grid, Matcher, SupportedLocale, WeekDayFormat } from '@destyler/shared'
import { createContext, getDefaultDate, handleCalendarInitialFocus } from '@destyler/shared'
import { useDirection, useForwardExpose, useVModel } from '@destyler/composition'
import type { Formatter } from '@destyler/composition'
import { isEqualDay, isSameDay } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

import { useCalendar, useCalendarState } from '../composition/use-calendar'

export const calendarRootProps = {
  ...primitiveProps,
  /**
   * The default value for the calendar
   *
   * @default undefined
   */
  defaultValue: {
    type: Object as PropType<DateValue>,
    required: false,
    default: undefined,
  },
  /**
   * The default placeholder date
   */
  defaultPlaceholder: {
    type: Object as PropType<DateValue>,
    required: false,
  },
  /**
   * The placeholder date, which is used to determine what month to
   * display when no date is selected. This updates as the user navigates
   * the calendar and can be used to programmatically control the
   * calendar view
   *
   * @default undefined
   */
  placeholder: {
    type: Object as PropType<DateValue>,
    required: false,
    default: undefined,
  },
  /**
   * This property causes the previous and next buttons
   * to navigate by the number of months displayed at
   * once, rather than one month
   *
   * @default false
   */
  pagedNavigation: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * Whether or not to prevent the user from deselecting
   * a date without selecting another date first
   *
   * @default false
   */
  preventDeselect: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * The day of the week to start the calendar on
   *
   * @default 0
   */
  weekStartsOn: {
    type: Number as PropType<0 | 1 | 2 | 3 | 4 | 5 | 6>,
    required: false,
    default: 0,
  },
  /**
   * The format to use for the weekday strings provided via the weekdays slot prop
   *
   * @default narrow
   */
  weekdayFormat: {
    type: String as PropType<WeekDayFormat>,
    required: false,
    default: 'narrow',
  },
  /**
   * The accessible label for the calendar
   */
  calendarLabel: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * Whether or not to always display 6 weeks in the calendar
   *
   * @default false
   */
  fixedWeeks: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * The maximum date that can be selected
   */
  maxValue: {
    type: Object as PropType<DateValue>,
    required: false,
  },
  /**
   * The minimum date that can be selected
   */
  minValue: {
    type: Object as PropType<DateValue>,
    required: false,
  },
  /**
   * The locale to use for formatting dates
   */
  locale: {
    type: String as PropType<SupportedLocale>,
    required: false,
    default: 'en',
  },
  /**
   * The number of months to display at once
   *
   * @default 1
   */
  numberOfMonths: {
    type: Number as PropType<number>,
    required: false,
    default: 1,
  },
  /**
   * Whether or not the calendar is disabled
   *
   * @default false
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * Whether or not the calendar is readonly
   *
   * @default false
   */
  readonly: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * If true, the calendar will focus the selected day, today,
   * or the first day of the month depending on what is
   * visible when the calendar is mounted
   *
   * @default false
   */
  initialFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * A function that returns whether or not a date is disabled
   *
   * @default undefined
   */
  isDateDisabled: {
    type: Function as PropType<Matcher>,
    required: false,
    default: undefined,
  },
  /**
   * A function that returns whether or not a date is unavailable
   *
   * @default undefined
   */
  isDateUnavailable: {
    type: Function as PropType<Matcher>,
    required: false,
    default: undefined,
  },
  /**
   * The controlled checked state of the calendar. Can be bound as `v-model`.
   */
  modelValue: {
    type: [Object, Array] as PropType<DateValue | DateValue[] | undefined>,
    required: false,
  },
  /**
   * Whether or not multiple dates can be selected
   *
   * @default false
   */
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * The reading direction of the calendar when applicable.
   *
   * @default ltr
   */
  dir: {
    type: String as PropType<Direction>,
    required: false,
    default: 'ltr',
  },
} as const

export type CalendarRootProps = ExtractPublicPropTypes<typeof calendarRootProps>

export const calendarRootEmits = {
  /**
   * Event handler called whenever the model value changes
   */
  'update:modelValue': (_value: DateValue | undefined) => true,
  /**
   * Event handler called whenever the placeholder value changes
   */
  'update:placeholder': (_value: DateValue) => true,
}

export interface CalendarRootContext {
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
  dir: Ref<Direction>
}

export const [injectCalendarRootContext, provideCalendarRootContext]
  = createContext<CalendarRootContext>('DestylerCalendarRoot')

export const CalendarRoot = defineComponent({
  name: 'DestylerCalendarRoot',
  props: calendarRootProps,
  emits: calendarRootEmits,
  slots: Object as SlotsType<{
    default: (opts: {
      /**
       * The current date of the placeholder
       */
      date: DateValue
      /**
       * The grid of dates
       */
      grid: Grid<DateValue>[]
      /**
       * The days of the week
       */
      weekDays: string[]
    }) => VNode[]
  }>,
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
      defaultValue,
      dir: propDir,
    } = toRefs(props)

    const { forwardRef, currentElement: parentElement } = useForwardExpose()

    const dir = useDirection(propDir)

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: defaultValue.value,
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
      placeholder.value = value.copy()
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
      locale,
      placeholder,
      weekStartsOn,
      fixedWeeks,
      numberOfMonths,
      minValue,
      maxValue,
      disabled,
      weekdayFormat,
      pagedNavigation,
      isDateDisabled: propsIsDateDisabled.value,
      isDateUnavailable: propsIsDateUnavailable.value,
      calendarLabel,
    })

    const {
      isInvalid,
      isDateSelected,
    } = useCalendarState({
      date: modelValue,
      isDateDisabled,
      isDateUnavailable,
    })

    watch(modelValue, (_modelValue) => {
      if (Array.isArray(_modelValue) && _modelValue.length) {
        const lastValue = _modelValue[_modelValue.length - 1]
        if (lastValue && !isEqualDay(placeholder.value, lastValue))
          onPlaceholderChange(lastValue)
      }
      else if (!Array.isArray(_modelValue) && _modelValue && !isEqualDay(placeholder.value, _modelValue)) {
        onPlaceholderChange(_modelValue)
      }
    })

    function onDateChange(value: DateValue) {
      if (!multiple.value) {
        if (!modelValue.value) {
          modelValue.value = value.copy()
          return
        }

        if (!preventDeselect.value && isEqualDay(modelValue.value as DateValue, value)) {
          placeholder.value = value.copy()
          modelValue.value = undefined
        }
        else { modelValue.value = value.copy() }
      }
      else if (Array.isArray(modelValue.value)) {
        if (!modelValue.value) {
          modelValue.value = [value.copy()]

          return
        }

        const index = modelValue.value.findIndex(date => isSameDay(date, value))
        if (index === -1) {
          modelValue.value = [...modelValue.value, value]
        }
        else if (!preventDeselect.value) {
          const next = modelValue.value.filter(date => !isSameDay(date, value))
          if (!next.length) {
            placeholder.value = value.copy()
            modelValue.value = undefined
            return
          }
          modelValue.value = next.map(date => date.copy())
        }
      }
    }

    onMounted(() => {
      if (initialFocus.value)
        handleCalendarInitialFocus(parentElement.value)
    })

    provideCalendarRootContext({
      isDateUnavailable,
      dir,
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
    })

    return {
      dir,
      forwardRef,
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
    return h(Primitive, {
      'ref': (el: any) => this.forwardRef(el),
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'role': 'application',
      'aria-label': this.fullCalendarLabel,
      'data-readonly': this.readonly ? '' : undefined,
      'data-disabled': this.disabled ? '' : undefined,
      'data-invalid': this.isInvalid ? '' : undefined,
      'dir': this.dir,
    }, {
      default: () => {
        return [
          this.$slots.default?.({
            date: this.placeholder,
            grid: this.grid,
            weekDays: this.weekdays,
          }),
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

        ]
      },
    })
  },
})
