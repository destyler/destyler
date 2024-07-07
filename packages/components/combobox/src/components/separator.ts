import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const comboboxSeparatorProps = {
  ...primitiveProps,
} as const

export type ComboboxSeparatorProps = ExtractPublicPropTypes<typeof comboboxSeparatorProps>

export const ComboboxSeparator = defineComponent({
  name: 'DestylerComboboxSeparator',
  props: comboboxSeparatorProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'aria-hidden': '',
    }), () => this.$slots.default?.())
  },
})
