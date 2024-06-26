import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuGroup, destylerMenuGroupProps } from '@destyler/menu'

export const destylerContextMenuGroupProps = {
  ...destylerMenuGroupProps,
} as const

export type DestylerContextMenuGroupProps = ExtractPublicPropTypes<typeof destylerContextMenuGroupProps>

export const DestylerContextMenuGroup = defineComponent({
  name: 'DestylerContextMenuGroup',
  props: destylerContextMenuGroupProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuGroup, this.$props, () => this.$slots.default?.())
  },
})
