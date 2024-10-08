import type { ComputedRef, PropType, Ref } from 'vue'
import { computed, defineComponent, h, nextTick, watch } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext, isNumber } from '@destyler/shared'
import { useVModel } from '@destyler/composition'

export const DEFAULT_MAX = 100

export const progressRootProps = {
  ...primitiveProps,
  /**
   * The progress value. Can be bind as `v-model`.
   */
  modelValue: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  /**
   * The maximum progress value.
   *
   * @default 100
   */
  max: {
    type: Number as PropType<number>,
    required: false,
    default: DEFAULT_MAX,
  },
  /**
   * A function to get the accessible label text representing the current value in a human-readable format.
   *
   *  If not provided, the value label will be read as the numeric value as a percentage of the max value.
   *
   * @default `(value: number, max: number) => string`
   */
  getValueLabel: {
    type: Function as PropType<(value: number, max: number) => string>,
    required: false,
    default: (value: number, max: number) => `${Math.round((value / max) * DEFAULT_MAX)}%`,
  },
} as const

export type ProgressRootProps = ExtractPublicPropTypes<typeof progressRootProps>

export const progressRootEmits = {
  /**
   * Event handler called when the progres value changes
   */
  'update:modelValue': (_value: string[] | undefined) => true,
  /**
   * Event handler called when the max value changes
   */
  'update:max': (_value: number) => true,
}

export interface ProgressRootContext {
  modelValue?: Readonly<Ref<number | null>>
  max: Readonly<Ref<number>>
  progressState: ComputedRef<ProgressState>
}

export const [injectProgressRootContext, provideProgressRootContext]
  = createContext<ProgressRootContext>('DestylerProgressRoot')

export type ProgressState = 'indeterminate' | 'loading' | 'complete'

export const ProgressRoot = defineComponent({
  name: 'DestylerProgressRoot',
  props: progressRootProps,
  emits: progressRootEmits,
  setup(props, { emit }) {
    function validateValue(value: any, max: number): number | null {
      const isValidValueError
        = value === null
        || (isNumber(value) && !Number.isNaN(value) && value <= max && value >= 0)

      if (isValidValueError)
        return value

      console.error(`Invalid prop \`value\` of value \`${value}\` supplied to \`ProgressRoot\`. The \`value\` prop must be:
      - a positive number
      - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
      - \`null\` if the progress is indeterminate.

    Defaulting to \`null\`.`)
      return null
    }

    function validateMax(max: number): number {
      const isValidMaxError = isNumber(max) && !Number.isNaN(max) && max > 0

      if (isValidMaxError)
        return max

      console.error(
        `Invalid prop \`max\` of value \`${max}\` supplied to \`ProgressRoot\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`,
      )
      return DEFAULT_MAX
    }

    const modelValueRef = useVModel(props, 'modelValue', emit, {
      passive: (props.modelValue === undefined) as false,
    }) as Ref<number | null>

    const max = useVModel(props, 'max', emit, {
      passive: (props.max === undefined) as false,
    })

    watch(
      () => modelValueRef.value,
      async (value) => {
        const correctedValue = validateValue(value, props.max)
        if (correctedValue !== value) {
          await nextTick()
          modelValueRef.value = correctedValue
        }
      },
      { immediate: true },
    )

    watch(
      () => props.max,
      (newMax) => {
        const correctedMax = validateMax(props.max)
        if (correctedMax !== newMax)
          max.value = correctedMax
      },
      { immediate: true },
    )

    const progressState = computed<ProgressState>(() => {
      if (!modelValueRef.value)
        return 'indeterminate'
      if (modelValueRef.value === max.value)
        return 'complete'
      return 'loading'
    })

    provideProgressRootContext({
      modelValue: modelValueRef,
      max,
      progressState,
    })

    return {
      max,
      modelValue: modelValueRef,
      progressState,
    }
  },
  render() {
    return h(Primitive, {
      'asChild': this.$props.asChild,
      'as': this.$props.as,
      'role': 'progressbar',
      'aria-valuemax': this.max,
      'aria-valuemin': 0,
      'aria-valuenow': isNumber(this.modelValue) ? this.modelValue : undefined,
      'aria-valuetext': this.$props.getValueLabel(this.modelValue!, this.max),
      'aria-label': this.$props.getValueLabel(this.modelValue!, this.max),
      'data-state': this.progressState,
      'data-value': this.modelValue ?? undefined,
      'data-max': this.max,
    }, () => this.$slots.default?.())
  },
})
