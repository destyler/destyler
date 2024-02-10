import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { DataOrientation, Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerToggleGroupRoot } from '@destyler/toggle'

import { injectToolbarRootContext } from './root'

export type TypeEnum = 'single' | 'multiple'

export const destylerToolbarToggleGroupProps = {
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
  type: {
    type: String as PropType<TypeEnum>,
    required: false,
    default: 'single',
  },
  defaultValue: {
    type: [String, Array] as PropType<string | string[]>,
    required: false,
  },
  modelValue: {
    type: [String, Array] as PropType<string | string[]>,
    required: false,
  },
  rovingFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  orientation: {
    type: String as PropType<DataOrientation>,
    required: false,
  },
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  loop: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
} as const

export type DestylerToolbarToggleGroupProps = ExtractPublicPropTypes<typeof destylerToolbarToggleGroupProps>

export const DestylerToolbarToggleGroup = defineComponent({
  name: 'DestylerToolbarToggleGroup',
  props: destylerToolbarToggleGroupProps,
  emits: ['update:modelValue'],
  setup(_, { emit }) {
    const rootContext = injectToolbarRootContext()

    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()

    return {
      rootContext,
      emitsAsProps,
    }
  },
  render() {
    return h(DestylerToggleGroupRoot, mergeProps(this.$props, this.emitsAsProps, {
      'rovingFocus': false,
      'dir': this.rootContext.dir.value,
      'data-orientation': this.rootContext.orientation.value,
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
