import { defineComponent, h, mergeProps } from 'vue'
import { TeleportPrimitive } from '@destyler/teleport'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectPreviewRootContext } from './root'

export const previewDialogProps = {
  ...primitiveProps,
} as const

export type PreviewDialogProps = ExtractPublicPropTypes<typeof previewDialogProps>

export const PreviewDialog = defineComponent({
  name: 'DestylerPreviewDialog',
  inheritAttrs: false,
  props: previewDialogProps,
  setup() {
    const rootContent = injectPreviewRootContext()

    return {
      rootContent,
    }
  },
  render() {
    return h(TeleportPrimitive, null, () => [
      this.rootContent.isPreviewActive.value
        ? h(Primitive, mergeProps(this.$attrs, {
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
