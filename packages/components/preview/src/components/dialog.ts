import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { DestylerTeleport } from '@destyler/teleport'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectPreviewRootContext } from './root'

export const destylerPreviewDialogProps = {
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

export type DestylerPreviewDialogProps = ExtractPublicPropTypes<typeof destylerPreviewDialogProps>

export const DestylerPreviewDialog = defineComponent({
  name: 'DestylerPreviewDialog',
  inheritAttrs: false,
  props: destylerPreviewDialogProps,
  setup() {
    const rootContent = injectPreviewRootContext()

    return {
      rootContent,
    }
  },
  render() {
    return h(DestylerTeleport, [
      this.rootContent.isPreviewActive.value
        ? h(DestylerPrimitive, mergeProps(this.$attrs, {
          as: this.$props.as,
          asChild: this.$props.asChild,
          onClick: () => {
            this.rootContent.isPreviewActive.value = false
          },
        }))
        : null,
    ])
  },
})
