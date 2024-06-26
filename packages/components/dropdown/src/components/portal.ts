import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DestylerMenuPortal, destylerMenuPortalProps } from '@destyler/menu'

export const destylerDropdownPortalProps = {
  ...destylerMenuPortalProps,
} as const

export type DestylerDropdownPortalProps = ExtractPublicPropTypes<typeof destylerDropdownPortalProps>

export const DestylerDropdownPortal = defineComponent({
  name: 'DestylerDropdownPortal',
  props: destylerDropdownPortalProps,
  render() {
    return h(DestylerMenuPortal, this.$props, () => this.$slots.default?.())
  },
})
