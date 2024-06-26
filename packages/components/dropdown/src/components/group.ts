import { defineComponent, h } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuGroup } from '@destyler/menu'

export const destylerDropdownGroupProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerDropdownGroupProps = ExtractPublicPropTypes<typeof destylerDropdownGroupProps>

export const DestylerDropdownGroup = defineComponent({
  name: 'DestylerDropdownGroup',
  props: destylerDropdownGroupProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuGroup, this.$props, () => this.$slots.default?.())
  },
})
