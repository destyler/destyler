import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuGroup, menuGroupProps } from '@destyler/menu'

export const contextMenuGroupProps = {
  ...menuGroupProps,
} as const

export type ContextMenuGroupProps = ExtractPublicPropTypes<typeof contextMenuGroupProps>

export const ContextMenuGroup = defineComponent({
  name: 'DestylerContextMenuGroup',
  props: contextMenuGroupProps,

  setup() {
    useForwardExpose()
  },
  render() {
    return h(MenuGroup, this.$props, () => this.$slots.default?.())
  },
})
