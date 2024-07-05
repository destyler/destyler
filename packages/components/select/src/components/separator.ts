import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const selectSeparatorProps = {
  ...primitiveProps,
} as const

export type SelectSeparatorProps = ExtractPublicPropTypes<typeof selectSeparatorProps>

export const SelectSeparator = defineComponent({
  name: 'DestylerSelectSeparator',
  props: selectSeparatorProps,
  render() {
    return h(Primitive, this.$props, () => this.$slots.default?.())
  },
})
