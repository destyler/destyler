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
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type MenuContentProps = ExtractPublicPropTypes<typeof menuContentProps>

export const menuContentEmits = {
  closeAutoFocus: menuContentImplEmits.closeAutoFocus,
  escapeKeyDown: menuContentImplEmits.escapeKeyDown,
  pointerDownOutside: menuContentImplEmits.pointerDownOutside,
  focusOutside: menuContentImplEmits.focusOutside,
  interactOutside: menuContentImplEmits.interactOutside,
}

export const MenuContent = defineComponent({
  name: 'DestylerMenuContent',
  props: menuContentProps,
  emits: ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'closeAutoFocus', 'dismiss'],
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
