import { defineComponent, h, mergeProps } from 'vue'
import { DestylerDialogDescription, destylerDialogDescriptionProps } from '@destyler/dialog'

export const destylerModalDescriptionProps = {
  ...destylerDialogDescriptionProps,
}

export const DestylerModalDescription = defineComponent({
  name: 'DestylerModalDescription',
  props: destylerModalDescriptionProps,
  render() {
    return h(DestylerDialogDescription, mergeProps(this.$props), this.$slots.default?.())
  },
})
