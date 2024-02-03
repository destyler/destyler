import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerTeleport } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerModalPortalProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerModalPortalProps = ExtractPublicPropTypes<typeof destylerModalPortalProps>

export const DestylerModalPortal = defineComponent({
  name: 'DestylerModalPortal',
  props: destylerModalPortalProps,
  render() {
    return h(DestylerTeleport, {
      as: this.$props.as,
      asChild: this.$props.asChild,
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
