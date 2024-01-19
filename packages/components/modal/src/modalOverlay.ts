import { defineComponent, h, mergeProps } from 'vue'
import { DestylerDialogOverlay, destylerDialogOverlayProps } from '@destyler/dialog'

export const destylerModalOverlayProps = {
  ...destylerDialogOverlayProps,
}

export const DestylerModalOverlay = defineComponent({
  name: 'DestylerModalOverlay',
  props: destylerModalOverlayProps,
  render() {
    return h(DestylerDialogOverlay, mergeProps(this.$props), this.$slots.default?.())
  },
})
