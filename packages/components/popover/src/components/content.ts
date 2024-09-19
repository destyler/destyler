import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'
import { Presence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { popoverContentImplEmits, popoverContentImplProps } from './contentImpl'
import { injectPopoverRootContext } from './root'
import { PopoverContentModal } from './contentModal'
import { PopoverContentNonModal } from './contentNonModal'

export const popoverContentProps = {
  ...popoverContentImplProps,
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with Vue animation libraries.
   *
   * @default false
   */
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type PopoverContentProps = ExtractPublicPropTypes<typeof popoverContentProps>

export const popoverContentEmits = {
  ...popoverContentImplEmits,
}

export const PopoverContent = defineComponent({
  name: 'DestylerPopoverContent',
  props: popoverContentProps,
  emits: popoverContentEmits,
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

    return h(Presence, {
      present: this.forceMount || this.rootContext.open.value,
    }, () => useVShow
      ? h(PopoverContentModal, {
        ...this.forwarded,
      }, () => this.$slots.default?.())
      : h(PopoverContentNonModal, {
        ...this.forwarded,
      }, () => this.$slots.default?.()))
  },
})
