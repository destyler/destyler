import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { DialogRoot, dialogRootProps } from '@destyler/dialog'
import { dialogRootEmits } from '@destyler/dialog/component'

export const modalRootProps = {
  open: {
    ...dialogRootProps.open,
  },
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
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
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
