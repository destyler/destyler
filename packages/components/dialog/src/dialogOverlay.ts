import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPresence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectDialogRootContext } from './dialogRoot'
import { DestylerDialogOverlayImpl } from './dialogOverlayImpl'

export const destylerDialogOverlayProps = {
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
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerDialogOverlayProps = ExtractPublicPropTypes<typeof destylerDialogOverlayProps>

export const DestylerDialogOverlay = defineComponent({
  name: 'DestylerDialogOverlay',
  props: destylerDialogOverlayProps,
  setup() {
    const rootContext = injectDialogRootContext()

    return {
      rootContext,
    }
  },
  render() {
    const useVShow = this.rootContext?.modal.value
    return useVShow
      ? h(DestylerPresence, {
        present: this.$props.forceMount || this.rootContext.open.value,
      }, h(DestylerDialogOverlayImpl, mergeProps(this.$attrs, {
        as: this.$props.as,
        asChild: this.$props.asChild,
      }), this.$slots.default?.()))
      : null
  },
})
