import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerComboboxViewportProps = {
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
} as const

export type DestylerComboboxViewportProps = ExtractPublicPropTypes<typeof destylerComboboxViewportProps>

export const DestylerComboboxViewport = defineComponent({
  name: 'DestylerComboboxViewport',
  props: destylerComboboxViewportProps,
  inheritAttrs: false,
  setup() {
    const { forwardRef } = useForwardExpose()

    return {
      forwardRef,
    }
  },
  render() {
    return [
      h(DestylerPrimitive, mergeProps(this.$attrs, {
        'ref': (el: any) => this.forwardRef(el),
        'data-destyler-combobox-viewport': '',
        'role': 'presentation',
        'style': {
          position: 'relative',
          flex: 1,
          overflow: 'auto',
        },
      }), () => this.$slots.default?.()),
      h(DestylerPrimitive, {
        as: 'style',
      }, () => `
      /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */
      [data-destyler-combobox-viewport] {
        scrollbar-width:none;
        -ms-overflow-style: none;
        -webkit-overflow-scrolling: touch;
      }
      [data-destyler-combobox-viewport]::-webkit-scrollbar {
        display: none;
      }
      `),
    ]
  },
})
