import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuGroup, destylerMenuGroupProps } from '@destyler/menu'

export const destylerMenubarGroupProps = {
  ...destylerMenuGroupProps,
} as const

export type DestylerMenubarGroupProps = ExtractPublicPropTypes<typeof destylerMenubarGroupProps>

export const DestylerMenubarGroup = defineComponent({
  name: 'DestylerMenubarGroup',
  props: destylerMenubarGroupProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuGroup, this.$props, () => this.$slots.default?.())
  },
})
