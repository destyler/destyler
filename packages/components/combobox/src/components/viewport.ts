import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const comboboxViewportProps = {
  ...primitiveProps,
} as const

export type ComboboxViewportProps = ExtractPublicPropTypes<typeof comboboxViewportProps>

export const ComboboxViewport = defineComponent({
  name: 'DestylerComboboxViewport',
  props: comboboxViewportProps,
  inheritAttrs: false,
  setup() {
    const { forwardRef } = useForwardExpose()

    return {
      forwardRef,
    }
  },
  render() {
    return [
      h(Primitive, mergeProps(this.$attrs, {
        'ref': (el: any) => this.forwardRef(el),
        'data-destyler-combobox-viewport': '',
        'role': 'presentation',
        'style': {
          position: 'relative',
          flex: 1,
          overflow: 'auto',
        },
      }), () => this.$slots.default?.()),
      h(Primitive, {
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
