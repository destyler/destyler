import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerToggleGroupItem } from '@destyler/toggle'

import { DestylerToolbarButton } from './button'

export const destylerToolbarToggleItemProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  defaultValue: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  pressed: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  value: {
    type: String as PropType<string>,
    required: true,
  },
} as const

export type DestylerToolbarToggleItemProps = ExtractPublicPropTypes<typeof destylerToolbarToggleItemProps>

export const DestylerToolbarToggleItem = defineComponent({
  name: 'DestylerToolbarToggleItem',
  props: destylerToolbarToggleItemProps,
  setup() {
    const { forwardRef } = useForwardExpose()

    return {
      forwardRef,
    }
  },
  render() {
    return h(DestylerToolbarButton, {
      asChild: true,
    }, {
      default: () => {
        return h(DestylerToggleGroupItem, {
          ...this.$props,
          ref: this.forwardRef,
        }, {
          default: () => this.$slots.default?.(),
        })
      },
    })
  },
})
