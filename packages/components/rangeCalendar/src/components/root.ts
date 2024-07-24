import type { PropType, Ref, SlotsType, VNode } from 'vue'
import { defineComponent, h, onMounted, ref, toRefs, watch } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { DateRange, Direction, ExtractPublicPropTypes, Grid, Matcher, SupportedLocale, WeekDayFormat } from '@destyler/shared'
import { createContext, getDefaultDate, handleCalendarInitialFocus, isBefore } from '@destyler/shared'
import type { Formatter } from '@destyler/composition'
import { useDirection, useForwardExpose, useVModel } from '@destyler/composition'
import type { DateValue } from '@internationalized/date'
import { isEqualDay } from '@internationalized/date'
import { useCalendar } from '@destyler/calendar/composition'
import { useRangeCalendarState } from '../composition/use-range-calendar-state'

export const rangeCalendarRootProps = {
  ...primitiveProps,
  defaultPlaceholder: {
    type: Object as PropType<DateValue>,
    required: false,
  },
  defaultValue: {
    type: Object as PropType<DateRange>,
    required: false,
    default: () => ({ start: undefined, end: undefined }),
  },
  modelValue: {
    type: Object as PropType<DateRange>,
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
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
} as const

export type RangeCalendarRootProps = ExtractPublicPropTypes<typeof rangeCalendarRootProps>

export interface RangeCalendarRootContext {
  modelValue: Ref<DateRange>
  startValue: Ref<DateValue | undefined>
  endValue: Ref<DateValue | undefined>
  locale: Ref<string>
  placeholder: Ref<DateValue>
  pagedNavigation: Ref<boolean>
  preventDeselect: Ref<boolean>
  weekStartsOn: Ref<0 | 1 | 2 | 3 | 4 | 5 | 6>
  weekdayFormat: Ref<WeekDayFormat>
  fixedWeeks: Ref<boolean>
  numberOfMonths: Ref<number>
  disabled: Ref<boolean>
  readonly: Ref<boolean>
  initialFocus: Ref<boolean>
  onPlaceholderChange: (date: DateValue) => void
  fullCalendarLabel: Ref<string>
  parentElement: Ref<HTMLElement | undefined>
  headingValue: Ref<string>
  isInvalid: Ref<boolean>
  nextPage: () => void
  prevPage: () => void
  isDateDisabled: Matcher
  isDateUnavailable?: Matcher
  isOutsideVisibleView: (date: DateValue) => boolean
  highlightedRange: Ref<{ start: DateValue, end: DateValue } | null>
  focusedValue: Ref<DateValue | undefined>
  lastPressedDateValue: Ref<DateValue | undefined>
  isSelected: (date: DateValue) => boolean
  isSelectionEnd: (date: DateValue) => boolean
  isSelectionStart: (date: DateValue) => boolean
  isNextButtonDisabled: Ref<boolean>
  isPrevButtonDisabled: Ref<boolean>
  formatter: Formatter
  dir: Ref<Direction>
}

export const [injectRangeCalendarRootContext, provideRangeCalendarRootContext] = createContext<RangeCalendarRootContext>('DestylerRangeCalendarRoot')

export const rangeCalendarRootEmits = {
  'update:modelValue': (_date: DateRange) => true,
  'update:placeholder': (_date: DateValue) => true,
  'update:startValue': (_date: DateValue | undefined) => true,
}

export const RangeCalendarRoot = defineComponent({
  name: 'DestylerRangeCalendarRoot',
  props: rangeCalendarRootProps,
  emits: rangeCalendarRootEmits,
  slots: Object as SlotsType<{
    default: (opts: {
      date: DateValue
      grid: Grid<DateValue>[]
      weekDays: string[]
    }) => VNode[]
  }>,
  setup(props, { emit }) {
    const {
      disabled,
      readonly,
      initialFocus,
      pagedNavigation,
      weekStartsOn,
      weekdayFormat,
      fixedWeeks,
      numberOfMonths,
      preventDeselect,
      isDateUnavailable: propsIsDateUnavailable,
      isDateDisabled: propsIsDateDisabled,
      calendarLabel,
      maxValue,
      minValue,
      locale,
      dir: propsDir,
    } = toRefs(props)

    const { forwardRef, currentElement: parentElement } = useForwardExpose()
    const dir = useDirection(propsDir)

    const lastPressedDateValue = ref() as Ref<DateValue | undefined>
    const focusedValue = ref() as Ref<DateValue | undefined>

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue,
      passive: (props.modelValue === undefined) as false,
    }) as Ref<DateRange>

    const defaultDate = getDefaultDate({
      defaultPlaceholder: props.placeholder,
      defaultValue: modelValue.value.start,
    })

    const startValue = ref(modelValue.value.start) as Ref<DateValue | undefined>
    const endValue = ref(modelValue.value.end) as Ref<DateValue | undefined>

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
      grid,
      weekdays,
      isOutsideVisibleView,
      nextPage,
      prevPage,
      formatter,
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
      isSelected,
      highlightedRange,
      isSelectionStart,
      isSelectionEnd,
    } = useRangeCalendarState({
      start: startValue,
      end: endValue,
      isDateDisabled,
      isDateUnavailable,
      focusedValue,
    })

    watch(modelValue, (_modelValue) => {
      if (_modelValue.start && _modelValue.end) {
        if (startValue.value && !isEqualDay(startValue.value, _modelValue.start))
          startValue.value = _modelValue.start.copy()

        if (endValue.value && !isEqualDay(endValue.value, _modelValue.end))
          endValue.value = _modelValue.end.copy()
      }
    })

    watch(startValue, (_startValue) => {
      if (_startValue && !isEqualDay(_startValue, placeholder.value))
        onPlaceholderChange(_startValue)

      emit('update:startValue', _startValue)
    })

    watch([startValue, endValue], ([_startValue, _endValue]) => {
      const value = modelValue.value

      if (value && value.start && value.end && _startValue && _endValue && isEqualDay(value.start, _startValue) && isEqualDay(value.end, _endValue))
        return

      if (_startValue && _endValue) {
        if (value.start && value.end && isEqualDay(value.start, _startValue) && isEqualDay(value.end, _endValue))
          return
        if (isBefore(_endValue, _startValue)) {
          modelValue.value = {
            start: _endValue.copy(),
            end: _startValue.copy(),
          }
        }
        else {
          modelValue.value = {
            start: _startValue.copy(),
            end: _endValue.copy(),
          }
        }
      }
      else if (value.start && value.end) {
        modelValue.value = {
          start: undefined,
          end: undefined,
        }
      }
    })

    provideRangeCalendarRootContext({
      isDateUnavailable,
      startValue,
      endValue,
      formatter,
      modelValue,
      placeholder,
      disabled,
      initialFocus,
      pagedNavigation,
      weekStartsOn,
      weekdayFormat,
      fixedWeeks,
      numberOfMonths,
      readonly,
      preventDeselect,
      fullCalendarLabel,
      headingValue,
      isInvalid,
      isDateDisabled,
      highlightedRange,
      focusedValue,
      lastPressedDateValue,
      isSelected,
      isSelectionEnd,
      isSelectionStart,
      isNextButtonDisabled,
      isPrevButtonDisabled,
      isOutsideVisibleView,
      nextPage,
      prevPage,
      parentElement,
      onPlaceholderChange,
      locale,
      dir,
    })

    onMounted(() => {
      if (initialFocus.value)
        handleCalendarInitialFocus(parentElement.value)
    })

    return {
      dir,
      fullCalendarLabel,
      readonly,
      disabled,
      isInvalid,
      defaultDate,
      placeholder,
      grid,
      weekdays,
      formatter,
      forwardRef,
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
          }),
        ]
      },
    })
  },
})
