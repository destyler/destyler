import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerComboboxSeparatorProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerComboboxSeparatorProps = ExtractPublicPropTypes<typeof destylerComboboxSeparatorProps>

export const DestylerComboboxSeparator = defineComponent({
  name: 'DestylerComboboxSeparator',
  props: destylerComboboxSeparatorProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'aria-hidden': '',
    }))
  },
})
