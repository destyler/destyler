import { defineComponent, h, mergeProps } from 'vue'
import { DestylerDialogTrigger, destylerDialogTriggerProps } from '@destyler/dialog'

export const destylerModalTriggerProps = {
  ...destylerDialogTriggerProps,
}

export const DestylerModalTrigger = defineComponent({
  name: 'DestylerModalTrigger',
  props: destylerModalTriggerProps,
  render() {
    return h(DestylerDialogTrigger, mergeProps(this.$props), this.$slots.default?.())
  },
})
