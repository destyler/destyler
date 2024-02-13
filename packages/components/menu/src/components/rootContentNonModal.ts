import { defineComponent, h, mergeProps } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'

import { DestylerMenuContentImpl, destylerMenuContentImplProps } from './contentImpl'
import { injectMenuContext } from './root'

export const DestylerMenuRootContentNonModal = defineComponent({
  name: 'DestylerMenuRootContentNonModal',
  props: destylerMenuContentImplProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss', 'entryFocus'],
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)

    const menuContext = injectMenuContext()

    return {
      forwarded,
      menuContext,
    }
  },
  render() {
    return h(DestylerMenuContentImpl, mergeProps(this.forwarded, {
      'trap-focus': false,
      'disableOutsidePointerEvents': false,
      'disable-outside-scroll': false,
      'onDismiss': () => {
        this.menuContext.onOpenChange(false)
      },
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
