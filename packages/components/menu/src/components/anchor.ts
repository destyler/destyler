import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DestylerPopperAnchor, destylerPopperAnchorProps } from '@destyler/popper'

export const destylerMenuAnchorProps = {
  ...destylerPopperAnchorProps,
} as const

export type DestylerMenuAnchorProps = ExtractPublicPropTypes<typeof destylerMenuAnchorProps>

export const DestylerMenuAnchor = defineComponent({
  name: 'DestylerMenuAnchor',
  props: destylerMenuAnchorProps,
  render() {
    return h(DestylerPopperAnchor, this.$props, () => this.$slots.default?.())
  },
})
