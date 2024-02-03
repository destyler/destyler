import { defineComponent, h, mergeProps } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'

import { DestylerMenuContentImpl, destylerMenuContentImplProps } from './menuContentImpl'
import { injectMenuContext } from './menuRoot'

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
      'disable-outside-pointer-events': false,
      'disable-outside-scroll': false,
      "onDismiss": () => {
        this.menuContext.onOpenChange(false)
      },
    }), this.$slots.default?.())
  },
})
