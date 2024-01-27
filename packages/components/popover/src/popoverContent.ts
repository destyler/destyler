import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'

import { destylerPopoverContentImplEmits, destylerPopoverContentImplProps } from './popoverContentImpl'
import { injectPopoverRootContext } from './popoverRoot'
import { DestylerPopoverContentModal } from './popoverContentModal'
import { DestylerPopoverContentNonModal } from './popoverContentNonModal'

export const destylerPopoverContentProps = {
  ...destylerPopoverContentImplProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
}

export const destylerPopoverContentEmits = [...destylerPopoverContentImplEmits]

export const DestylerPopoverContent = defineComponent({
  name: 'DestylerPopoverContent',
  props: destylerPopoverContentProps,
  emits: destylerPopoverContentEmits,
  setup(props, { emit }) {
    const rootContext = injectPopoverRootContext()

    const forwarded = useForwardPropsEmits(props, emit)

    return {
      rootContext,
      forwarded,
    }
  },
  render() {
    const useVShow = this.rootContext.modal.value

    return h(DestylerPresence, {
      present: this.forceMount || this.rootContext.open.value,
    }, useVShow
      ? h(DestylerPopoverContentModal, {
        ...this.forwarded,
      }, this.$slots.default?.())
      : h(DestylerPopoverContentNonModal, {
        ...this.forwarded,
      }, this.$slots.default?.()))
  },
})
