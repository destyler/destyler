import type { PropType, Ref, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, onMounted, toRefs, watch } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { Direction, ExtractPublicPropTypes, Grid, Matcher, SupportedLocale, WeekDayFormat } from '@destyler/shared'
import { createContext, createDecade, createYear, getDefaultDate, handleCalendarInitialFocus } from '@destyler/shared'
import { useDirection, useForwardExpose, useVModel } from '@destyler/composition'
import type { Formatter } from '@destyler/composition'
import { isEqualDay, isSameDay } from '@internationalized/date'
import type { CalendarDate, CalendarDateTime, DateValue, ZonedDateTime } from '@internationalized/date'

import { useCalendar, useCalendarState } from '../composition/use-calendar'

export const calendarRootProps = {
  ...primitiveProps,
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
  dir: {
    type: String as PropType<Direction>,
    required: false,
    default: 'ltr',
  },
} as const

export type CalendarRootProps = ExtractPublicPropTypes<typeof calendarRootProps>

export const calendarRootEmits = {
  'update:modelValue': (_value: DateValue | undefined) => true,
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
      date: DateValue
      grid: Grid<DateValue>[]
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
