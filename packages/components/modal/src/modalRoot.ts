import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'
import { DestylerDialogRoot } from '@destyler/dialog'

export const destylerModalRootProps = {
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
}

export const DestylerModalRoot = defineComponent({
  name: 'DestylerModalRoot',
  props: destylerModalRootProps,
  emits: ['update:open'],
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)

    return {
      forwarded,
    }
  },
  render() {
    return h(DestylerDialogRoot, mergeProps(this.forwarded, {
      modal: true,
    }), this.$slots.default?.())
  },
})
