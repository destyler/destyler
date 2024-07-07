import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'

import { MenuContentImpl, menuContentImplEmits, menuContentImplProps } from './contentImpl'
import { injectMenuContext } from './root'

export const MenuRootContentNonModal = defineComponent({
  name: 'DestylerMenuRootContentNonModal',
  props: menuContentImplProps,
  emits: menuContentImplEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
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
