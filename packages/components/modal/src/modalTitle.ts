import { defineComponent, h, mergeProps } from 'vue'
import { DestylerDialogTitle, destylerDialogTitleProps } from '@destyler/dialog'

export const destylerModalTitleProps = {
  ...destylerDialogTitleProps,
}

export const DestylerModalTitle = defineComponent({
  name: 'DestylerModalTitle',
  props: destylerModalTitleProps,
  render() {
    return h(DestylerDialogTitle, mergeProps(this.$props), this.$slots.default?.())
  },
})
