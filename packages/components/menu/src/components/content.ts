import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardPropsEmits } from '@destyler/composition'
import { Presence } from '@destyler/presence'

import { menuContentImplEmits, menuContentImplProps } from './contentImpl'
import { injectMenuContext, injectMenuRootContext } from './root'
import { MenuRootContentModal } from './rootContentModal'
import { MenuRootContentNonModal } from './rootContentNonModal'

export const menuContentProps = {
  ...menuContentImplProps,
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with Vue animation libraries.
   */
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type MenuContentProps = ExtractPublicPropTypes<typeof menuContentProps>

export const menuContentEmits = {
  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented.
   */
  closeAutoFocus: menuContentImplEmits.closeAutoFocus,
  /**
   * Event handler called when the escape key is down.
   * Can be prevented.
   */
  escapeKeyDown: menuContentImplEmits.escapeKeyDown,
  /**
   * Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`.
   * Can be prevented.
   */
  pointerDownOutside: menuContentImplEmits.pointerDownOutside,
  /**
   * Event handler called when the focus moves outside of the `DismissableLayer`.
   * Can be prevented.
   */
  focusOutside: menuContentImplEmits.focusOutside,
  /**
   * Event handler called when an interaction happens outside the `DismissableLayer`.
   * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
   * Can be prevented.
   */
  interactOutside: menuContentImplEmits.interactOutside,
}

export const MenuContent = defineComponent({
  name: 'DestylerMenuContent',
  props: menuContentProps,
  emits: menuContentEmits,
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)

    const menuContext = injectMenuContext()
    const rootContext = injectMenuRootContext()

    return {
      forwarded,
      menuContext,
      rootContext,
    }
  },
  render() {
    return h(Presence, {
      present: this.forceMount || this.menuContext.open.value,
    }, () => {
      if (this.rootContext.modal.value)
        return h(MenuRootContentModal, mergeProps(this.$attrs, this.forwarded), () => this.$slots.default?.())
      else
        return h(MenuRootContentNonModal, mergeProps(this.$attrs, this.forwarded), () => this.$slots.default?.())
    })
  },
})
