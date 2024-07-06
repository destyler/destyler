import type { PropType, Ref } from 'vue'
import { computed, defineComponent, h, onMounted, ref, toRefs, watch } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { DateRange, ExtractPublicPropTypes, Matcher, SupportedLocale, WeekDayFormat } from '@destyler/shared'
import { createContext, createDecade, createYear, getDefaultDate, handleCalendarInitialFocus, isBefore } from '@destyler/shared'
import type { Formatter } from '@destyler/composition'
import { useForwardExpose, useVModel } from '@destyler/composition'
import type { DateValue } from '@internationalized/date'
import { isSameDay } from '@internationalized/date'
import { useCalendar } from '@destyler/calendar/dist/composition'
import { useRangeCalendarState } from '../composition/use-range-calendar-state'

export const rangeCalendarRootProps = {
  ...primitiveProps,
  defaultPlaceholder: {
    type: Object as PropType<DateValue>,
    required: false,
  },
  defaultValue: {
    type: Object as PropType<{ start: DateValue, end: DateValue }>,
    required: false,
    default: undefined,
  },
  modelValue: {
    type: Object as PropType<{ start: DateValue | undefined, end: DateValue | undefined }>,
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
} as const

export type RangeCalendarRootProps = ExtractPublicPropTypes<typeof rangeCalendarRootProps>

export interface RangeCalendarRootContext {
  modelValue: Ref<{ start: DateValue | undefined, end: DateValue | undefined }>
  startValue: Ref<DateValue | undefined>
  endValue: Ref<DateValue | undefined>
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
  defaultDate: DateValue
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
    } = toRefs(props)

    const { forwardRef, currentElement: parentElement } = useForwardExpose()

    const lastPressedDateValue = ref() as Ref<DateValue | undefined>
    const focusedValue = ref() as Ref<DateValue | undefined>

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? { start: undefined, end: undefined },
      passive: (props.modelValue === undefined) as false,
    }) as Ref<{ start: DateValue | undefined, end: DateValue | undefined }>

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
      placeholder.value = defaultDate.set({ ...value })
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
      isSelected,
      highlightedRange,
      isSelectionStart,
      isSelectionEnd,
    } = useRangeCalendarState({
      start: startValue,
      end: endValue,
      grid,
      isDateDisabled,
      isDateUnavailable,
      focusedValue,
    })

    watch(modelValue, () => {
      if (modelValue.value.start && modelValue.value.end) {
        if (modelValue.value.start.toString() !== startValue.value?.toString())
          startValue.value = defaultDate.set({ ...modelValue.value.start })

        if (modelValue.value.end.toString() !== endValue.value?.toString())
          endValue.value = defaultDate.set({ ...modelValue.value.end })
      }
    })

    watch(startValue, (value) => {
      if (value && !isSameDay(value, placeholder.value))
        onPlaceholderChange(value)
    })

    watch([startValue, endValue], () => {
      if (modelValue.value && modelValue.value.start?.toString() === startValue.value?.toString() && modelValue.value.end?.toString() === endValue.value?.toString())
        return

      if (startValue.value && endValue.value) {
        if (isBefore(endValue.value, startValue.value)) {
          modelValue.value = {
            start: defaultDate.set({ ...endValue.value }),
            end: defaultDate.set({ ...startValue.value }),
          }
        }

        else {
          modelValue.value = {
            start: defaultDate.set({ ...startValue.value }),
            end: defaultDate.set({ ...endValue.value }),
          }
        }
      }
    })

    const getMonths = computed(() => {
      const dateObj = defaultDate.set({ ...placeholder.value })
      return createYear({
        dateObj,
        minValue: minValue.value,
        maxValue: maxValue.value,
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
        minValue: minValue.value,
        maxValue: maxValue.value,
      })
    }

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
      defaultDate,
      onPlaceholderChange,
    })

    onMounted(() => {
      if (initialFocus.value)
        handleCalendarInitialFocus(parentElement.value)
    })

    return {
      fullCalendarLabel,
      readonly,
      disabled,
      isInvalid,
      defaultDate,
      placeholder,
      grid,
      weekdays,
      formatter,
      getMonths,
      forwardRef,
      getYears,
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
            date: this.defaultDate.set({ ...this.placeholder }),
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
