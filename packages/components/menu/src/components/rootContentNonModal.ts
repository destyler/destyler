import { defineComponent, h, mergeProps } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'

import { MenuContentImpl, menuContentImplProps } from './contentImpl'
import { injectMenuContext } from './root'

export const MenuRootContentNonModal = defineComponent({
  name: 'DestylerMenuRootContentNonModal',
  props: menuContentImplProps,
  emits: ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'entryFocus', 'openAutoFocus', 'closeAutoFocus'],
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)

    const menuContext = injectMenuContext()

    return {
      forwarded,
      menuContext,
    }
  },
  render() {
    return h(MenuContentImpl, mergeProps(this.forwarded, {
      'trap-focus': false,
      'disableOutsidePointerEvents': false,
      'disable-outside-scroll': false,
      'onDismiss': () => {
        this.menuContext.onOpenChange(false)
      },
    }), () => this.$slots.default?.())
  },
})
