import { defineComponent, h, mergeProps } from 'vue'

import { DestylerDialogClose, destylerDialogCloseProps } from '@destyler/dialog'

export const destylerModalActionProps = {
  ...destylerDialogCloseProps,
}

export const DestylerModalAction = defineComponent({
  name: 'DestylerModalAction',
  props: destylerModalActionProps,
  render() {
    return h(DestylerDialogClose, mergeProps(this.$props), this.$slots.default?.())
  },
})
