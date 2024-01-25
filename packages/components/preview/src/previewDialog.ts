import { defineComponent, h, mergeProps } from 'vue'
import { DestylerTeleport } from '@destyler/teleport'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { injectPreviewRootContext } from './previewRoot'

export const destylerPreviewDialogProps = {
  ...destylerPrimitiveProps,
}

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
