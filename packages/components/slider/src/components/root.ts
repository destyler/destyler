import type { PropType, Ref, SlotsType, VNode } from 'vue'
import { defineComponent, h, ref, toRaw, toRefs } from 'vue'
import type { DataOrientation, Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { primitiveProps } from '@destyler/primitive'
import { createCollection } from '@destyler/collection/composition'
import { CollectionSlot } from '@destyler/collection'
import { useDirection, useFormControl, useForwardExpose, useVModel } from '@destyler/composition'

import { ARROW_KEYS, PAGE_KEYS, clamp, getClosestValueIndex, getDecimalCount, getNextSortedValues, hasMinStepsBetweenValues, roundValue } from '../utils'
import { SliderVertical } from './vertical'
import { SliderHorizontal } from './horizontal'

export const sliderRootProps = {
  ...primitiveProps,

  name: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * The value of the slider when initially rendered. Use when you do not need to control the state of the slider.
   * @default () => [0]
   */
  defaultValue: {
    type: Array as PropType<number[]>,
    required: false,
    default: () => [0],
  },
  /**
   * The controlled value of the slider. Can be bind as `v-model`.
   *
   * @default undefined
   */
  modelValue: {
    type: Array as PropType<number[]>,
    required: false,
    default: undefined,
  },
  /**
   * When `true`, prevents the user from interacting with the slider.
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * The orientation of the slider.
   *
   * @default horizontal
   */
  orientation: {
    type: String as PropType<DataOrientation>,
    required: false,
    default: 'horizontal',
  },
  /**
   * The reading direction of the slider when applicable.
   */
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  /**
   * Whether the slider is visually inverted.
   *
   * @default false
   */
  inverted: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * The minimum value for the range.
   *
   * @default 0
   */
  min: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  /**
   * The maximum value for the range.
   *
   * @default 100
   */
  max: {
    type: Number as PropType<number>,
    required: false,
    default: 100,
  },
  /**
   * The stepping interval.
   *
   * @default 1
   */
  step: {
    type: Number as PropType<number>,
    required: false,
    default: 1,
  },
  /**
   * The minimum permitted steps between multiple thumbs.
   *
   * @default 0
   */
  minStepsBetweenThumbs: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
} as const

export type SliderRootProps = ExtractPublicPropTypes<typeof sliderRootProps>

export interface SliderRootContext {
  orientation: Ref<DataOrientation>
  disabled: Ref<boolean>
  min: Ref<number>
  max: Ref<number>
  modelValue?: Readonly<Ref<number[] | undefined>>
  valueIndexToChangeRef: Ref<number>
  thumbElements: Ref<HTMLElement[]>
}

export const [injectSliderRootContext, provideSliderRootContext] = createContext<SliderRootContext>('DestylerSliderRoot')

export const sliderRootEmits = {
  /**
   * Event handler called when the slider value changes
   */
  'update:modelValue': (_payload: number[] | undefined) => true,
  /**
   * Event handler called when the value changes at the end of an interaction.
   *
   * Useful when you only need to capture a final value e.g. to update a backend service.
   */
  'valueCommit': (_payload: number[]) => true,
}

export const SliderRoot = defineComponent({
  name: 'DestylerSliderRoot',
  inheritAttrs: false,
  props: sliderRootProps,
  emit: sliderRootEmits,
  slots: Object as SlotsType<{
    default: (opts: {
      /**
       * Current slider values
       */
      modelValue: number[]
    }) => VNode[]
  }>,
  setup(props, { emit }) {
    const { min, max, step, minStepsBetweenThumbs, orientation, disabled, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)
    const { forwardRef, currentElement } = useForwardExpose()
    const isFormControl = useFormControl(currentElement)

    createCollection()

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue,
      passive: (props.modelValue === undefined) as false,
    }) as Ref<number[]>

    const valueIndexToChangeRef = ref(0)
    const valuesBeforeSlideStartRef = ref(modelValue.value)

    function handleSlideStart(value: number) {
      const closestIndex = getClosestValueIndex(modelValue.value, value)
      updateValues(value, closestIndex)
    }

    function handleSlideMove(value: number) {
      updateValues(value, valueIndexToChangeRef.value)
    }

    function handleSlideEnd() {
      const prevValue = valuesBeforeSlideStartRef.value[valueIndexToChangeRef.value]
      const nextValue = modelValue.value[valueIndexToChangeRef.value]
      const hasChanged = nextValue !== prevValue
      if (hasChanged)
        emit('valueCommit', toRaw(modelValue.value))
    }

    const thumbElements = ref<HTMLElement[]>([])

    function updateValues(value: number, atIndex: number, { commit } = { commit: false }) {
      const decimalCount = getDecimalCount(step.value)
      const snapToStep = roundValue(Math.round((value - min.value) / step.value) * step.value + min.value, decimalCount)
      const nextValue = clamp(snapToStep, [min.value, max.value])

      const nextValues = getNextSortedValues(modelValue.value, nextValue, atIndex)

      if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs.value * step.value)) {
        valueIndexToChangeRef.value = nextValues.indexOf(nextValue)
        const hasChanged = String(nextValues) !== String(modelValue.value)
        if (hasChanged && commit)
          emit('valueCommit', nextValues)

        if (hasChanged) {
          thumbElements.value[valueIndexToChangeRef.value]?.focus()
          modelValue.value = nextValues
        }
      }
    }

    provideSliderRootContext({
      modelValue,
      valueIndexToChangeRef,
      thumbElements,
      orientation,
      min,
      max,
      disabled,
    })

    return {
      forwardRef,
      orientation,
      min,
      max,
      dir,
      disabled,
      valuesBeforeSlideStartRef,
      modelValue,
      step,
      valueIndexToChangeRef,
      isFormControl,
      handleSlideStart,
      handleSlideMove,
      handleSlideEnd,
      updateValues,
    }
  },
  render() {
    return h(CollectionSlot, () => [
      h(this.orientation === 'horizontal' ? SliderHorizontal : SliderVertical, {
        ...this.$attrs,
        'ref': (el: any) => this.forwardRef(el),
        'asChild': this.$props.asChild,
        'as': this.$props.as,
        'min': this.min,
        'max': this.max,
        'dir': this.dir,
        'inverted': this.$props.inverted,
        'aria-disabled': this.disabled,
        'data-disabled': this.disabled ? '' : undefined,
        'onPointerdown': () => {
          if (!this.disabled)
            this.valuesBeforeSlideStartRef = this.modelValue
        },
        'onSlideStart': (event: any) => {
          !this.disabled && this.handleSlideStart(event)
        },
        'onSlideMove': (event: any) => {
          !this.disabled && this.handleSlideMove(event)
        },
        'onSlideEnd': () => {
          !this.disabled && this.handleSlideEnd()
        },
        'onHomeKeyDown': () => {
          !this.disabled && this.updateValues(this.min, 0, { commit: true })
        },
        'onEndKeyDown': () => {
          !this.disabled && this.updateValues(this.max, this.modelValue.length - 1, { commit: true })
        },
        'onStepKeyDown': (event: any, direction: any) => {
          if (!this.disabled) {
            const isPageKey = PAGE_KEYS.includes(event.key)
            const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.includes(event.key))
            const multiplier = isSkipKey ? 10 : 1
            const atIndex = this.valueIndexToChangeRef
            const value = this.modelValue[atIndex]
            const stepInDirection = this.step! * multiplier * direction
            this.updateValues(value + stepInDirection, atIndex, { commit: true })
          }
        },
      }, () => this.$slots.default?.({ modelValue: this.modelValue })),
      this.isFormControl
        ? [this.modelValue.map((value, index) => h('input', {
            key: index,
            value,
            type: 'number',
            style: {
              display: 'none',
            },
            name: this.name ? this.name + (this.modelValue.length > 1 ? '[]' : '') : undefined,
            disabled: this.disabled,
            step: this.step,
          }))]
        : null,
    ])
  },
})
