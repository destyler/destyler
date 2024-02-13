import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DestylerMenuPortal } from '@destyler/menu'

export const destylerDropdownPortalProps = {
  to: {
    type: [String, Object] as PropType<string | HTMLElement>,
    required: false,
    default: 'body',
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerDropdownPortalProps = ExtractPublicPropTypes<typeof destylerDropdownPortalProps>

export const DestylerDropdownPortal = defineComponent({
  name: 'DestylerDropdownPortal',
  props: destylerDropdownPortalProps,
  render() {
    return h(DestylerMenuPortal, this.$props, {
      default: () => this.$slots.default?.(),
    })
  },
})
