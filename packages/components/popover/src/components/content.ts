import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { destylerPopoverContentImplEmits, destylerPopoverContentImplProps } from './contentImpl'
import { injectPopoverRootContext } from './root'
import { DestylerPopoverContentModal } from './contentModal'
import { DestylerPopoverContentNonModal } from './contentNonModal'

export const destylerPopoverContentProps = {
  ...destylerPopoverContentImplProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerPopoverContentProps = ExtractPublicPropTypes<typeof destylerPopoverContentProps>

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
    }, () => useVShow
      ? h(DestylerPopoverContentModal, {
        ...this.forwarded,
      }, () => this.$slots.default?.())
      : h(DestylerPopoverContentNonModal, {
        ...this.forwarded,
      }, () => this.$slots.default?.()))
  },
})
