import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { DialogRoot, dialogRootProps } from '@destyler/dialog'
import { dialogRootEmits } from '@destyler/dialog/component'

export const modalRootProps = {
  /**
   * The controlled open state of the dialog.
   * Can be binded as `v-model:open`.
   */
  open: {
    ...dialogRootProps.open,
  },
  /**
   * The open state of the dialog when it is initially rendered. Use when you do not need to control its open state.
   */
  defaultOpen: {
    ...dialogRootProps.defaultOpen,
  },
} as const

export type ModalRootProps = ExtractPublicPropTypes<typeof modalRootProps>

export const modalRootEmits = {
  ...dialogRootEmits,
}

export const ModalRoot = defineComponent({
  name: 'DestylerModalRoot',
  props: modalRootProps,
  emits: modalRootEmits,
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)
    useForwardExpose()

    return {
      forwarded,
    }
  },
  render() {
    return h(DialogRoot, mergeProps(this.forwarded, {
      modal: true,
    }), () => this.$slots.default?.())
  },
})
