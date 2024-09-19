import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { PopperAnchor, popperAnchorProps } from '@destyler/popper'

export const menuAnchorProps = {
  ...popperAnchorProps,
} as const

export type MenuAnchorProps = ExtractPublicPropTypes<typeof menuAnchorProps>

export const MenuAnchor = defineComponent({
  name: 'DestylerMenuAnchor',
  props: menuAnchorProps,
  render() {
    return h(PopperAnchor, this.$props, () => this.$slots.default?.())
  },
})
