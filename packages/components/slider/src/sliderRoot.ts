import type { Component, PropType, Ref } from 'vue'
import { defineComponent, h, mergeProps, ref, toRefs } from 'vue'
import type { DataOrientation, Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import type { AsTag } from '@destyler/primitive'
import { useCollection, useCustomElement, useDirection, useFormControl, useVModel } from '@destyler/composition'

import { ARROW_KEYS, PAGE_KEYS, clamp, getClosestValueIndex, getDecimalCount, getNextSortedValues, hasMinStepsBetweenValues, roundValue } from './utils'
import { DestylerSliderVertical } from './sliderVertical'
import { DestylerSliderHorizontal } from './sliderHorizontal'

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

export const destylerSliderRootProps = {
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
  name: {
    type: String as PropType<string>,
    required: false,
  },
  defaultValue: {
    type: Array as PropType<number[]>,
    required: false,
  },
  modelValue: {
    type: Array as PropType<number[]>,
    required: false,
    default: () => [0],
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  orientation: {
    type: String as PropType<DataOrientation>,
    required: false,
    default: 'horizontal',
  },
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  inverted: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  min: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  max: {
    type: Number as PropType<number>,
    required: false,
    default: 100,
  },
  step: {
    type: Number as PropType<number>,
    required: false,
    default: 1,
  },
  minStepsBetweenThumbs: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
} as const

export type DestylerSliderRootProps = ExtractPublicPropTypes<typeof destylerSliderRootProps>

export const DestylerSliderRoot = defineComponent({
  name: 'DestylerSliderRoot',
  inheritAttrs: false,
  props: destylerSliderRootProps,
  emits: ['update:modelValue', 'valueCommit'],
  setup(props, { emit }) {
    const { min, max, step, minStepsBetweenThumbs, orientation, disabled, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)
    const { createCollection } = useCollection('sliderThumb')
    const { customElement, currentElement } = useCustomElement()
    createCollection(currentElement)
    const isFormControl = useFormControl(currentElement)

    const thumbElements = ref<HTMLElement[]>([])

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
        emit('valueCommit', modelValue.value)
    }

    function updateValues(value: number, atIndex: number, { commit } = { commit: false }) {
      const decimalCount = getDecimalCount(step.value!)
      const snapToStep = roundValue(Math.round((value - min.value) / step.value!) * step.value! + min.value, decimalCount)
      const nextValue = clamp(snapToStep, [min.value, max.value])
      const nextValues = getNextSortedValues(modelValue.value, nextValue, atIndex)
      if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs.value * step.value!)) {
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
      customElement,
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
    return [
      h(this.orientation === 'horizontal' ? DestylerSliderHorizontal : DestylerSliderVertical, mergeProps(this.$attrs, {
        'ref': 'customElement',
        'asChild': this.$props.asChild,
        'as': this.$props.as,
        'min': this.min,
        'max': this.max,
        'dir': this.dir,
        'inverted': this.$props.inverted,
        'aria-disabled': this.disabled,
        'data-disabled': this.disabled,
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
      }), this.$slots.default?.({ modelValue: this.modelValue })),
      this.isFormControl
        ? [
            this.modelValue.map((value, index) => h('input', {
              key: index,
              value,
              type: 'number',
              style: {
                display: 'none',
              },
              disabled: this.disabled,
              name: this.name ? this.name + (this.modelValue.length > 1 ? '[]' : '') : undefined,
            })),
          ]
        : null,
    ]
  },
})
