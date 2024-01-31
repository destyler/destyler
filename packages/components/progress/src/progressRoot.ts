import type { ComputedRef, PropType, Ref } from 'vue'
import { computed, defineComponent, h, nextTick, watch } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { createContext, isNumber } from '@destyler/shared'
import { useVModel } from '@destyler/composition'

export const DEFAULT_MAX = 100

export const destylerProgressRootProps = {
  ...destylerPrimitiveProps,
  modelValue: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  max: {
    type: Number as PropType<number>,
    required: false,
    default: DEFAULT_MAX,
  },
  getValueLabel: {
    type: Function as PropType<(value: number, max: number) => string>,
    required: false,
    default: (value: number, max: number) => `${Math.round((value / max) * DEFAULT_MAX)}%`,
  },
}

export interface ProgressRootContext {
  modelValue?: Readonly<Ref<number | null>>
  max: Readonly<Ref<number>>
  progressState: ComputedRef<ProgressState>
}

export const [injectProgressRootContext, provideProgressRootContext]
  = createContext<ProgressRootContext>('DestylerProgressRoot')

export type ProgressState = 'indeterminate' | 'loading' | 'complete'

export const DestylerProgressRoot = defineComponent({
  name: 'DestylerProgressRoot',
  props: destylerProgressRootProps,
  emits: ['update:modelValue', 'update:max'],
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
    return h(DestylerPrimitive, {
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
    }, this.$slots.default?.())
  },
})
